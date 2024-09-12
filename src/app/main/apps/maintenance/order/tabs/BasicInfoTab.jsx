import { Controller, useFormContext } from 'react-hook-form';
import { selectUser } from 'app/store/slices/user-slices/userSlice';
import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import { useState, useEffect } from 'react';
import { contratosApi, ordersApi, tagsApi } from 'app/store/apiInstances';
import { fetchApiData } from 'src/utils/fetchApiData';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
// Redux imports
import { useAppSelector, useAppDispatch } from 'app/store/hooks';
import { selectInmuebleLoading } from 'app/store/slices/inmueble-slice/inmueblesSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { orderStatuses } from '../OrdersStatus';

function formatAddress(inmueble) {
	const { direccion, urbanizacion, barrio, municipio } = inmueble;
	let parts = [direccion, urbanizacion, barrio, municipio];
	parts = parts.filter((part) => part); // Remove null or undefined values
	return parts.join(', ');
}

/**
 * Update the relation fields when a field is setted:
 * Contrato_id (PK) (1) -- (1) Inquilino_id, Propietario_id, Inmueble_id (Composite Key)
 * Cases:
 * 0. If not null values were deleted (check with DirtyFields):
 *  0.1. If the contrato_id is removed, clear everything and reset filters
 *  0.2. If any of composite keys is removed, delete the value from the form filters:
 *      0.2.1. If all of them are null reset the filters
 *		0.2.2. If there is contrato_id, it is not allowed to remove the value
 *      0.2.3. If there is at least one composite key, and there is not a contrato_id, we should go to 2.1
 * 1. If form values are null there are some other cases:
 * 	1.1. If the contrato_id is setted, we should update the other fields
 * 	1.2. If the inquilino_id is setted (or propietario_id or inmueble_id) we should update the other fields:
 *  	1.2.1. If there are multiple contracts, we update filter values of the other fields
 * 		1.2.2. If there is only one contract, we should update the other fields
 * 2. If the form values has at least one not null:
 * 	2.1. If not null values is one or many of the composite keys and input values are null:
 *  	2.1.1. If there are multiple contracts, we update filter values of the other fields
 * 		2.1.2. If there is only one contract, we should update the other fields
 * 	2.2. If not null values is one or many of the composite keys and there is one input value:
 *  	2.2.1. If there are multiple contracts, we update filter values of the other field
 * 		2.2.2. If there is only one contract, we should update the other fields
 * 	2.3. If the contrato_id was not null and the other fields are null, we should update the other fields automatically
 *  2.4. If the contrato_id was not null and the other fields are not null, we should update the other fields automatically (?) (Not sure about this one)
 * @param {Object} param0
 * @param {number} param0.inquilinoId
 * @param {number} param0.propietarioId
 * @param {number} param0.inmuebleId
 * @param {number} param0.contratoId
 * @param {Function} param0.setInquilinosFiltered
 * @param {Function} param0.setPropietariosFiltered
 * @param {Function} param0.setInmueblesFiltered
 * @param {Function} param0.setContratosFiltered
 * @param {Object} param0.formState
 * @param {Function} param0.setValue
 * @param {Function} param0.getValues
 * @returns {Promise<void>}
 */
async function UpdateRelationFieldsWhenFieldSetted({
	inquilinoId,
	propietarioId,
	inmuebleId,
	contratoId,
	setInquilinosFiltered,
	setPropietariosFiltered,
	setInmueblesFiltered,
	setContratosFiltered,
	formState,
	setValue,
	getValues,
	dispatch,
}) {
	// Base Setup
	const possibleFieldsMap = {
		contrato_id: {
			idCallback: (contract) => contract.id,
			setFiltered: setContratosFiltered,
			apiFieldName: 'id',
			inputValue: contratoId,
			keyType: 'PK',
		},
		propietario_id: {
			idCallback: (contract) => contract.propietario_id,
			setFiltered: setPropietariosFiltered,
			inputValue: propietarioId,
			keyType: 'Composite',
		},
		inquilino_id: {
			idCallback: (contract) => contract.inquilino_id,
			setFiltered: setInquilinosFiltered,
			inputValue: inquilinoId,
			keyType: 'Composite',
		},
		inmueble_id: {
			idCallback: (contract) => contract.inmueble_id,
			setFiltered: setInmueblesFiltered,
			inputValue: inmuebleId,
			keyType: 'Composite',
		},
	};

	// 0. If not null values were deleted (check with DirtyFields):
	const allInputsUndefined = Object.values(possibleFieldsMap).every(
		(field) => field.inputValue === undefined,
	);
	const isFirstLoad = !formState.isDirty && allInputsUndefined;
	const { dirtyFields } = formState;
	const values = getValues();
	const allValuesNull = Object.values(possibleFieldsMap).every(
		(field) => values[field] === null,
	);

	if (isFirstLoad && allValuesNull) {
		return;
	}

	// 0.1. If the contrato_id is removed, clear everything and reset filters

	if (
		dirtyFields.contrato_id &&
		possibleFieldsMap.contrato_id.inputValue === undefined &&
		values.contrato_id === undefined
	) {
		// Clear everything
		setValue('inquilino_id', null);
		setValue('propietario_id', null);
		setValue('inmueble_id', null);
		setValue('contrato_id', null);
		setInquilinosFiltered([]);
		setPropietariosFiltered([]);
		setInmueblesFiltered([]);
		setContratosFiltered([]);
		return;
	}

	// 0.2. If any of composite keys is removed, delete the value from the form filters:
	//  *   0.2.1. If all of them are null reset the filters
	//  *	0.2.2. If there is contrato_id, it is not allowed to remove the value
	//  *   0.2.3. If there is at least one composite key, and there is not a contrato_id, we should go to 2.1

	// 0.2.2. If there is contrato_id, it is not allowed to remove the value
	if (
		values.contrato_id !== null &&
		possibleFieldsMap.contrato_id.inputValue === values.contrato_id
	) {
		setValue('inquilino_id', null);
		setValue('propietario_id', null);
		setValue('inmueble_id', null);
	}

	// We already know that contrato_id is null
	//  *   0.2.3. If there is at least one composite key, and there is not a contrato_id, we should go to 2.1
	Object.entries(possibleFieldsMap).forEach(([fieldName, fieldProps]) => {
		// Check if composite keys are removed: when inputValue is undefined and the value is undefined

		if (
			fieldProps.keyType === 'Composite' &&
			dirtyFields[fieldName] &&
			fieldProps.inputValue === undefined &&
			values[fieldName] === undefined
		) {
			setValue(fieldName, null);
		}
	});

	// Build filters to search with useful information
	const filtersContratos = [];
	const values2 = getValues();

	// * 1. If form values are null there are some other cases
	//  * 	1.1. If the contrato_id is setted, we should update the other fields
	if (values.contrato_id !== null) {
		filtersContratos.push({
			name: possibleFieldsMap.contrato_id.apiFieldName,
			operator: 'eq',
			values: values2.contrato_id,
		});
	} else {
		//  * 	1.2. If the inquilino_id is setted (or propietario_id or inmueble_id) we should update the other fields
		Object.keys(possibleFieldsMap).forEach((field) => {
			const currFieldMap = possibleFieldsMap[field];

			if (currFieldMap.keyType !== 'Composite') {
				// If is not composite return
				return;
			}

			if (!values2[field]) {
				return;
			}

			const apiFieldName = currFieldMap.apiFieldName
				? currFieldMap.apiFieldName
				: field;
			filtersContratos.push({
				name: apiFieldName,
				operator: 'eq',
				values: values[field],
			});
		});
	}

	const bodyContratos = {
		filters: filtersContratos,
	};

	const bodyContratosStringified = JSON.stringify(bodyContratos);
	const limit = 10000;
	const slim = true;
	const response = await contratosApi
		.getContratos(limit, slim, bodyContratosStringified)
		.catch((error) => {
			dispatch(showMessage({ message: error.message, variant: 'error' }));
		});

	if (response.data.length === 1) {
		// Set the values
		const contract = response.data[0];
		Object.keys(possibleFieldsMap).forEach((field) => {
			const value = possibleFieldsMap[field].idCallback(contract);
			setValue(field, value, { shouldDirty: true }); // Kee the same dirty
		});
	} else if (response.data.length > 1) {
		// We have multiple contracts, we should update the options
		const contracts = response.data;
		Object.keys(possibleFieldsMap).forEach((field) => {
			const idsToFiltered = contracts.map((contract) =>
				possibleFieldsMap[field].idCallback(contract),
			);
			possibleFieldsMap[field].setFiltered(idsToFiltered);

			if (values[field] !== null) {
				return;
			}

			if (isFirstLoad) {
				return;
			}

			setValue(field, null, { shouldDirty: false }); // Reset the dirty
		});
	} else {
		// We don't have any contract
		dispatch(
			showMessage({
				message: 'No se encontraron contratos',
				variant: 'warning',
			}),
		);
	}
}

// callback: should return boolean (true or false)
function getFilteredOptionsWithCallback(options, callback) {
	const filtered = options.filter((option) => callback(option));
	return filtered;
}

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const dispatch = useAppDispatch();
	const { control, formState, setValue, getValues } = methods;
	const { errors } = formState;
	const user = useAppSelector(selectUser);
	const routeParams = useParams();
	const { orderId } = routeParams;
	const isUpdate = orderId !== 'new';
	let isDisabled = false;

	if (user.role !== 'admin') {
		// If the user is not an admin, we should disable the form
		isDisabled = true;
		dispatch(
			showMessage({
				message: 'No tienes permisos para crear una orden',
				variant: 'warning',
			}),
		);
	}

	const [tags, setTags] = useState([]);

	useEffect(() => {
		const fetchTags = async () => {
			const response = await tagsApi.getMaintenanceOrderTags();
			setTags(response.data);
		};

		fetchTags();
	}, []);

	const statusNames = orderStatuses
		.sort((a, b) => {
			return a.id - b.id;
		})
		.map((status) => status.name);

	const [contratistas, setContratistas] = useState([]);
	const [inquilinos, setInquilinos] = useState([]);
	const [propietarios, setPropietarios] = useState([]);
	const [contratos, setContratos] = useState([]);
	const [inmuebles, setInmuebles] = useState([]);
	const [inquilinosFiltered, setInquilinosFiltered] = useState([]);
	const [propietariosFiltered, setPropietariosFiltered] = useState([]);
	const [contratosFiltered, setContratosFiltered] = useState([]);
	const [inmueblesFiltered, setInmueblesFiltered] = useState([]);
	const isLoading = useAppSelector(selectInmuebleLoading);
	// Description Autofill
	const [descriptionInputValue, setDescriptionInputValue] = useState('');
	const timeoutDescriptionAutoFill = 1500; // 1.3 seconds

	useEffect(() => {
		fetchApiData(
			setContratistas,
			setInquilinos,
			setPropietarios,
			setContratos,
			setInmuebles,
		);
		UpdateRelationFieldsWhenFieldSetted({
			setContratosFiltered,
			setInquilinosFiltered,
			setPropietariosFiltered,
			setInmueblesFiltered,
			formState,
			setValue,
			getValues,
			dispatch,
		});
	}, []);

	// Debounce the API call
	const debouncedSave = _.debounce(() => {
		// Your API call goes here
		const tituloValue = getValues('titulo');
		const tagsValue = getValues('tags');
		const descripcionValue = getValues('descripcion');

		if (descriptionInputValue === '' && descripcionValue !== '') {
			// Set default value
			setDescriptionInputValue(descripcionValue);
			return;
		}

		if (
			descriptionInputValue === '' &&
			!formState.dirtyFields.descripcion
		) {
			return;
		}

		if (tituloValue !== '' && tagsValue.length > 0) {
			// Both were changed no need to update with API
			return;
		}

		const fetchApiData = async () => {
			const response = await ordersApi.getOrderInfoFromDescription(
				descriptionInputValue,
			);
			const { data } = response;

			// Set the title field value
			const newTags = data.tags.filter((tag) => !tags.includes(tag.tags));

			if (tituloValue === '') {
				setValue('titulo', data.titulo);
			}

			if (tagsValue.length === 0) {
				setTags([...tags, ...newTags]);
				setValue('tags', [...tagsValue, ...data.tags]);
			}
		};
		fetchApiData();
	}, timeoutDescriptionAutoFill);

	useEffect(() => {
		debouncedSave();
		// Cleanup function
		return () => {
			debouncedSave.cancel();
		};
	}, [descriptionInputValue]); // Only re-run effect if inputValue changes

	/*
	Calling the function to update the relation fields when the inquilino_id is setted
	TODO: ideally if the propietario is setted multiple inquilinos might be shown, we should alter the inquilinos variable
	If a contract is provided we should update the others too
	*/

	return (
		<div>
			{/* Contratos */}
			{isLoading && !contratos ? (
				<FuseLoading />
			) : (
				<Controller
					name="contrato_id"
					control={control}
					defaultValue={null}
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							options={contratos}
							value={
								contratos.find(
									(contrato) => contrato.id === value,
								) || ''
							}
							onChange={(event, newValue) => {
								onChange(newValue?.id);
								UpdateRelationFieldsWhenFieldSetted({
									contratoId: newValue?.id,
									setContratosFiltered,
									setInquilinosFiltered,
									setPropietariosFiltered,
									setInmueblesFiltered,
									formState,
									setValue,
									getValues,
									dispatch,
								});
							}}
							getOptionLabel={(option) => {
								if (option.id) {
									return String(option.id);
								}

								return String(option);
							}}
							filterOptions={(options, params) => {
								return getFilteredOptionsWithCallback(
									options,
									(option) => {
										let valid = true;

										if (
											valid &&
											contratosFiltered.length !== 0
										) {
											valid = contratosFiltered.includes(
												option.id,
											);
										}

										if (
											valid &&
											params.inputValue.length > 0
										) {
											valid = String(option.id).includes(
												params.inputValue,
											);
										}

										return valid;
									},
								);
							}}
							isOptionEqualToValue={(option, value) =>
								value ? option.id === value.id : true
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Contrato ID"
									required={!isUpdate}
									autoFocus
									type="number"
									error={!!errors.contrato}
									helperText={errors?.contrato?.message}
									disabled={isDisabled}
									className="mt-8 mb-16"
									variant="outlined"
								/>
							)}
						/>
					)}
				/>
			)}
			{/* Inquilino */}
			{isLoading && !inquilinos ? (
				<FuseLoading />
			) : (
				<Controller
					name="inquilino_id"
					control={control}
					defaultValue={null}
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							options={inquilinos}
							value={
								inquilinos.find(
									(inquilino) => inquilino.id === value,
								) || ''
							}
							onChange={(event, newValue) => {
								onChange(newValue?.id);
								// As we have selected it we can now setValue for Propietario, contract and Inmueble
								UpdateRelationFieldsWhenFieldSetted({
									inquilinoId: newValue?.id,
									setContratosFiltered,
									setInquilinosFiltered,
									setPropietariosFiltered,
									setInmueblesFiltered,
									formState,
									setValue,
									getValues,
								});
							}}
							getOptionLabel={(option) => {
								if (option.identificacion) {
									return `${option.identificacion}-${option.nombre}`;
								}

								return String(option);
							}}
							// getOptionLabel={(option) => option.nombre || ''}
							filterOptions={(options, params) => {
								return getFilteredOptionsWithCallback(
									options,
									(option) => {
										let valid = true;

										if (
											valid &&
											inquilinosFiltered.length !== 0
										) {
											valid = inquilinosFiltered.includes(
												option.id,
											);
										}

										if (
											valid &&
											params.inputValue.length > 0
										) {
											valid = option.nombre
												.toLowerCase()
												.includes(
													params.inputValue.toLowerCase(),
												);
										}

										return valid;
									},
								);
							}}
							isOptionEqualToValue={(option, value) =>
								value ? option.id === value.id : true
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Inquilino"
									required={!isUpdate}
									autoFocus
									error={!!errors.inquilino}
									helperText={errors?.inquilino?.message}
									disabled={isDisabled}
									className="mt-8 mb-16"
									variant="outlined"
								/>
							)}
						/>
					)}
				/>
			)}
			{/* Propietario */}
			{isLoading && !propietarios ? (
				<FuseLoading />
			) : (
				<Controller
					name="propietario_id"
					control={control}
					defaultValue={null}
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							options={propietarios}
							value={
								propietarios.find(
									(propietario) => propietario.id === value,
								) || ''
							}
							onChange={(event, newValue) => {
								onChange(newValue?.id);
								UpdateRelationFieldsWhenFieldSetted({
									propietarioId: newValue?.id,
									setContratosFiltered,
									setInquilinosFiltered,
									setPropietariosFiltered,
									setInmueblesFiltered,
									formState,
									setValue,
									getValues,
								});
							}}
							getOptionLabel={(option) => {
								if (option.identificacion) {
									return `${option.identificacion}-${option.nombre}`;
								}

								return String(option);
							}}
							// getOptionLabel={(option) => option.nombre || ''}
							filterOptions={(options, params) => {
								return getFilteredOptionsWithCallback(
									options,
									(option) => {
										let valid = true;

										if (
											valid &&
											propietariosFiltered.length !== 0
										) {
											valid =
												propietariosFiltered.includes(
													option.id,
												);
										}

										if (
											valid &&
											params.inputValue.length > 0
										) {
											valid = option.nombre
												.toLowerCase()
												.includes(
													params.inputValue.toLowerCase(),
												);
										}

										return valid;
									},
								);
							}}
							isOptionEqualToValue={(option, value) =>
								value ? option.id === value.id : true
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Propietario"
									required={!isUpdate}
									autoFocus
									error={!!errors.propietario}
									helperText={errors?.propietario?.message}
									disabled={isDisabled}
									className="mt-8 mb-16"
									variant="outlined"
								/>
							)}
						/>
					)}
				/>
			)}
			{/* Inmueble */}
			{isLoading && !inmuebles ? (
				<FuseLoading />
			) : (
				<Controller
					name="inmueble_id"
					control={control}
					defaultValue={null}
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							options={inmuebles}
							value={
								inmuebles.find(
									(inmueble) => inmueble.id === value,
								) || ''
							}
							onChange={(event, newValue) => {
								onChange(newValue?.id);
								UpdateRelationFieldsWhenFieldSetted({
									inmuebleId: newValue?.id,
									setContratosFiltered,
									setInquilinosFiltered,
									setPropietariosFiltered,
									setInmueblesFiltered,
									formState,
									setValue,
									getValues,
								});
							}}
							getOptionLabel={(option) => {
								if (option.direccion) {
									// Dirección completa
									return formatAddress(option);
								}

								return String(option);
							}}
							filterOptions={(options, params) => {
								return getFilteredOptionsWithCallback(
									options,
									(option) => {
										let valid = true;

										if (
											valid &&
											inmueblesFiltered.length !== 0
										) {
											valid = inmueblesFiltered.includes(
												option.id,
											);
										}

										if (
											valid &&
											params.inputValue.length > 0
										) {
											valid = formatAddress(option)
												.toLowerCase()
												.includes(
													params.inputValue.toLowerCase(),
												);
										}

										return valid;
									},
								);
							}}
							isOptionEqualToValue={(option, value) =>
								value ? option.id === value.id : true
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Inmueble"
									required={!isUpdate}
									autoFocus
									error={!!errors.inmueble}
									helperText={errors?.inmueble?.message}
									disabled={isDisabled}
									className="mt-8 mb-16"
									variant="outlined"
								/>
							)}
						/>
					)}
				/>
			)}
			{/* Descripción */}
			<Controller
				name="descripcion"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						value={descriptionInputValue}
						className="mt-8 mb-16"
						required={!isUpdate}
						label="Descripción"
						autoFocus
						onChange={(e) => {
							field.onChange(e); // This is necessary to update the form state
							setDescriptionInputValue(e.target.value);
						}}
						id="descripcion"
						variant="outlined"
						fullWidth
						multiline
						minRows={4} // Adjust as needed
						error={!!errors.descripcion}
						helperText={errors?.descripcion?.message}
						disabled={isDisabled}
						InputProps={{
							style: {
								transition: 'transform 0.15s ease-in-out',
								'&:hover': {
									transform: 'scale(1.05)',
								},
							},
						}}
					/>
				)}
			/>
			{/* Titulo */}
			<Controller
				name="titulo"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						value={field.value || ''}
						className="mt-8 mb-16"
						required={!isUpdate}
						label="Título"
						autoFocus
						id="titulo"
						variant="outlined"
						fullWidth
						rows={4} // Adjust as needed
						error={!!errors.titulo}
						helperText={errors?.titulo?.message}
						disabled={isDisabled}
						InputProps={{
							style: {
								transition: 'transform 0.15s ease-in-out',
								'&:hover': {
									transform: 'scale(1.05)',
								},
							},
						}}
					/>
				)}
			/>
			<Controller
				name="total_reparacion"
				control={control}
				defaultValue={null}
				render={({ field }) => {
					const [displayValue, setDisplayValue] = useState('');

					useEffect(() => {
						if (field.value) {
							setDisplayValue(
								new Intl.NumberFormat('en', {
									style: 'decimal',
								}).format(field.value),
							);
						} else {
							setDisplayValue('');
						}
					}, [field.value]);

					const handleInputChange = (event) => {
						// Remove all non-digit characters and convert to number
						const numericValue = parseFloat(
							event.target.value.replace(/[^0-9.]/g, ''),
						);
						// Update the field value
						field.onChange(
							Number.isNaN(numericValue) ? null : numericValue,
						);
					};

					return (
						<TextField
							{...field}
							value={displayValue}
							onChange={handleInputChange}
							className="mt-8 mb-16"
							label="Total Reparacion"
							autoFocus
							id="total_reparacion"
							variant="outlined"
							fullWidth
							rows={4} // Adjust as needed
							error={!!errors.total_reparacion}
							helperText={errors?.total_reparacion?.message}
							disabled={isDisabled}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										$
									</InputAdornment>
								),
								style: {
									transition: 'transform 0.15s ease-in-out',
									'&:hover': {
										transform: 'scale(1.05)',
									},
								},
							}}
						/>
					);
				}}
			/>
			{/* Contratista */}
			{isLoading && !contratistas ? (
				<FuseLoading />
			) : (
				<Controller
					name="contratista_id"
					control={control}
					defaultValue={null}
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							options={contratistas}
							value={
								contratistas.find(
									(contratista) => contratista.id === value,
								) || ''
							}
							onChange={(event, newValue) => {
								onChange(newValue?.id);
							}}
							getOptionLabel={(option) => {
								if (option.nombre) {
									return option.nombre;
								}

								return String(option);
							}}
							filterOptions={(options, params) => {
								const filtered = options.filter((option) =>
									option.nombre
										.toLowerCase()
										.includes(
											params.inputValue.toLowerCase(),
										),
								);

								return filtered;
							}}
							isOptionEqualToValue={(option, value) =>
								value ? option.id === value.id : true
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Contratista"
									autoFocus
									className="mt-8 mb-16"
									variant="outlined"
									disabled={isDisabled}
								/>
							)}
						/>
					)}
				/>
			)}
			{/* Status */}
			<Controller
				name="status"
				control={control}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						options={statusNames}
						value={value || 'ABIERTA'}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Estado"
								required={!isUpdate}
								autoFocus
								error={!!errors.status}
								helperText={errors?.status?.message}
								id="status"
								disabled={isDisabled}
								className="mt-8 mb-16"
								variant="outlined"
							/>
						)}
					/>
				)}
			/>
			{/* Tags */}
			{isLoading && !tags ? (
				<FuseLoading />
			) : (
				<Controller
					name="tags"
					control={control}
					defaultValue={[]}
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							multiple
							options={tags}
							value={Array.isArray(value) ? value : []}
							onChange={(event, newValue) => {
								onChange(newValue);
							}}
							getOptionLabel={(option) => option.tags}
							isOptionEqualToValue={(option, value) =>
								value ? option.tags === value.tags : true
							}
							filterOptions={(options, state) => {
								return options.filter((option) =>
									option.tags
										.toLowerCase()
										.includes(
											state.inputValue.toLowerCase(),
										),
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Selecciona las tags deseadas"
									label="Tags"
									id="tags"
									className="mt-8 mb-16"
									variant="outlined"
									InputLabelProps={{
										shrink: true,
									}}
								/>
							)}
						/>
					)}
				/>
			)}
		</div>
	);
}

export default BasicInfoTab;
