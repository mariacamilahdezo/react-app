import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import { FormControl, Select, MenuItem, Input } from '@mui/material';
// Redux imports
import {
	searchUsers,
	selectUsersLoading,
	selectUserTypes,
	searchUserTypes,
} from 'app/store/slices/user-slices/usersSlice';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';

const useStyles = makeStyles({
	select: {
		'& .MuiSelect-select': {
			paddingTop: '0 !important',
			paddingBottom: '0 !important',
			textAlign: 'center',
			display: 'flex', // Add this line
			alignItems: 'center',
			justifyContent: 'center',
		},
	},
});

/**
 * The contacts header.
 */
function ContactsHeader({ hasSearch, setHasSearch }) {
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector(selectUsersLoading);
	const userTypes = useAppSelector(selectUserTypes);
	const [searchText, setSearchText] = useState('');
	const [selectedOption, setSelectedOption] = useState('');
	const classes = useStyles();

	useEffect(() => {
		dispatch(searchUserTypes());
	}, [dispatch]);

	const handleSearch = (event) => {
		setSearchText(event.target.value);
	};
	const handleSelectType = (event) => {
		setSelectedOption(event.target.value);
		setSearchText('');
		const filters = [
			{
				name: 'Type.name',
				operator: 'eq',
				values: event.target.value,
			},
		];

		const body = {
			filters,
		};
		const slim = true;

		dispatch(searchUsers({ slim, body }));
		setHasSearch(false);
	};
	const handleClickSearch = () => {
		if (searchText.length < 3 && Number.isNaN(Number(searchText))) {
			dispatch(
				showMessage({
					message:
						'Elige tipo de usuario e ingresa al menos 3 letras o números',
					variant: 'warning',
				}),
			);
			return;
		}

		const orFilters = [
			{
				name: 'nombre',
				operator: 'ilike',
				values: `%${searchText}%`,
			},
			{
				name: 'identificacion',
				operator: 'ilike',
				values: `%${searchText}%`,
			},
			{
				name: 'celular',
				operator: 'ilike',
				values: `%${searchText}%`,
			},
		];

		if (
			!Number.isNaN(Number(searchText)) &&
			Math.abs(Number(searchText)) <= 2000000000 // Cannot search bigints
		) {
			orFilters.push({
				name: 'id',
				operator: 'eq',
				values: Number(searchText),
			});
		}

		const filters = [
			{
				name: 'Type.name',
				operator: 'eq',
				values: selectedOption,
			},
			{
				conjunction: 'or',
				filters: orFilters,
			},
		];

		const body = {
			filters,
		};
		const slim = true;
		dispatch(searchUsers({ slim, body }));
		setHasSearch(true);
	};

	return (
		<div className="p-24 sm:p-32 w-full border-b-1">
			<div className="flex flex-col">
				<motion.span
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
				>
					<Typography className="text-24 md:text-32 font-extrabold tracking-tight leading-none">
						Clientes, contratistas y colaboradores
					</Typography>
				</motion.span>
				<motion.span
					initial={{ y: -10, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
				/>
			</div>
			<div className="flex flex-1 items-center mt-16 -mx-8">
				<Box
					component={motion.div}
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className="flex flex-1 w-full sm:w-auto items-center px-0 mx-8 border-1 rounded-full"
				>
					<FormControl className="flex w-full sm:w-auto mr-2 text-center">
						<Select
							className={`flex w-full sm:w-auto items-center rounded-l-full text-center ${classes.select}`}
							variant="filled"
							labelId="select-types-label"
							id="select-types-label"
							displayEmpty
							inputProps={{ 'aria-label': 'Without label' }}
							value={selectedOption}
							onChange={(event) => handleSelectType(event)}
							style={{
								backgroundColor: 'lightgray',
								width: '200px',
							}}
						>
							<MenuItem
								value=""
								disabled
							>
								Elige tipo de usuario
							</MenuItem>
							{userTypes.map((userType) => (
								<MenuItem
									key={userType.id}
									value={userType.name}
									className={classes.menuItem}
								>
									{userType.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FuseSvgIcon
						color="action"
						size={20}
						className="mx-4"
					>
						heroicons-outline:search
					</FuseSvgIcon>
					<Input
						placeholder="Búsqueda de clientes, contratistas y colaboradores..."
						className="flex flex-1 px-16"
						disableUnderline
						fullWidth
						value={searchText}
						inputProps={{
							'aria-label': 'Search',
						}}
						onChange={(event) => handleSearch(event)}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								handleClickSearch();
							}
						}}
					/>
				</Box>
				<Button
					className="mx-8"
					variant="contained"
					color="secondary"
					onClick={() => {
						handleClickSearch();
					}}
				>
					<FuseSvgIcon size={20}>
						heroicons-outline:search
					</FuseSvgIcon>
					<span className="hidden sm:flex mx-8">Buscar</span>
				</Button>
			</div>
		</div>
	);
}

export default ContactsHeader;
