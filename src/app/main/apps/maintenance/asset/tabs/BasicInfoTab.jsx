import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'app/store/slices/user-slices/userSlice';
import { Alert } from '@mui/material';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	const user = useAppSelector(selectUser);
	const isDisabled = user.role !== 'admin';

	return (
		<div>
			{isDisabled && (
				<Alert severity="warning">
					No tienes permisos para editar el inmueble.
				</Alert>
			)}
			<Controller
				name="direccion"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						value={field.value || ''}
						className="mt-8 mb-16"
						required
						label="Dirección"
						autoFocus
						id="direccion"
						variant="outlined"
						fullWidth
						error={!!errors.direccion}
						helperText={errors?.direccion?.message}
						disabled={isDisabled}
					/>
				)}
			/>

			<Controller
				name="urbanizacion"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						value={field.value || ''}
						className="mt-8 mb-16"
						required
						id="urbanizacion"
						label="Urbanización"
						variant="outlined"
						error={!!errors.urbanizacion}
						helperText={errors?.urbanizacion?.message}
						fullWidth
						disabled={isDisabled}
					/>
				)}
			/>
			<Controller
				name="municipio"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						value={field.value || ''}
						className="mt-8 mb-16"
						id="municipio"
						label="Municipio"
						variant="outlined"
						fullWidth
						disabled={isDisabled}
					/>
				)}
			/>
			<Controller
				name="barrio"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						value={field.value || ''}
						className="mt-8 mb-16"
						required
						id="barrio"
						label="Barrio"
						variant="outlined"
						error={!!errors.barrio}
						helperText={errors?.barrio?.message}
						fullWidth
						disabled={isDisabled}
					/>
				)}
			/>
			<Controller
				name="zona"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						value={field.value || ''}
						className="mt-8 mb-16"
						required
						id="zona"
						label="Zona"
						variant="outlined"
						error={!!errors.zona}
						helperText={errors?.zona?.message}
						fullWidth
						disabled={isDisabled}
					/>
				)}
			/>
			<Controller
				name="telefono"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						value={field.value || ''}
						className="mt-8 mb-16"
						required
						id="telefono"
						label="Teléfono"
						variant="outlined"
						type="number"
						error={!!errors.telefono}
						helperText={errors?.telefono?.message}
						fullWidth
						disabled={isDisabled}
					/>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
