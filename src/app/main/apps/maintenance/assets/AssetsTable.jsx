/* eslint-disable react/no-unstable-nested-components */
// Importing hooks from React and components from Material-UI library
import { useMemo, useEffect } from 'react';
import DataTable from 'app/shared-components/general/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Redux imports
import {
	searchInmuebles,
	selectInmuebles,
	selectInmuebleLoading,
} from 'app/store/slices/inmueble-slice/inmueblesSlice';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

/**
 * Renders a table component for displaying orders.
 *
 * @returns {JSX.Element} The rendered OrdersTable component.
 */
function AssetsTable() {
	// Constants defining the state of the component
	const dispatch = useAppDispatch();
	const data = useAppSelector(selectInmuebles);
	const isLoading = useAppSelector(selectInmuebleLoading);
	useEffect(() => {
		dispatch(searchInmuebles());
	}, [dispatch]);

	// Define the columns for the table
	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'Id',
				size: 64,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/maintenance/inmuebles/${row.original.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.id}
					</Typography>
				),
			},
			{
				id: 'direccion',
				header: 'Dirección',
				accessorKey: 'direccion',
				size: 64,
			},
			{
				id: 'urbanizacion',
				accessorKey: 'urbanizacion',
				header: 'Urbanización',
				size: 64,
				accessorFn: (row) => row.urbanizacion || '',
			},
			{
				id: 'municipio',
				accessorKey: 'municipio',
				header: 'Municipio',
				size: 64,
				accessorFn: (row) => row.municipio || '',
			},
			{
				id: 'barrio',
				accessorKey: 'barrio',
				header: 'Barrio',
				size: 64,
				accessorFn: (row) => row.barrio || '',
			},
			{
				id: 'zona',
				accessorKey: 'zona',
				header: 'Zona',
				size: 64,
				accessorFn: (row) => row.zona || '',
			},
			{
				id: 'telefono',
				accessorKey: 'telefono',
				header: 'Teléfono',
				size: 64,
				accessorFn: (row) => row.telefono || '',
			},
			{
				id: 'clase',
				accessorKey: 'clase',
				header: 'Clase',
				accessorFn: (row) => row.clase || '',
			},
		],
		[],
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			<DataTable
				initialState={{
					density: 'spacious',
					showColumnFilters: false,
					showGlobalFilter: true,
					columnPinning: {
						left: ['mrt-row-expand', 'mrt-row-select'],
						right: ['mrt-row-actions'],
					},
					pagination: {
						pageIndex: 0,
						pageSize: 20,
					},
				}}
				data={data}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							removeProducts([row.original.id]);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
						</ListItemIcon>
						Eliminar
					</MenuItem>,
					<MenuItem
						key={1}
						onClick={() => {
							openDetailModal();
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>
								heroicons-outline:document-search
							</FuseSvgIcon>
						</ListItemIcon>
						Ver detalle
					</MenuItem>,
				]}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows =
									table.getSelectedRowModel().rows;
								removeData(
									selectedRows.map((row) => row.original.id),
								);
								table.resetRowSelection();
							}}
							className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8"
							color="secondary"
						>
							<FuseSvgIcon size={16}>
								heroicons-outline:trash
							</FuseSvgIcon>
							<span className="hidden sm:flex mx-8">
								Borrar items seleccionados
							</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

export default AssetsTable;
