/* eslint-disable react/no-unstable-nested-components */
// Importing hooks from React and components from Material-UI library
import { useMemo, useEffect } from 'react';
import DataTable from 'app/shared-components/general/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { ListItemIcon, MenuItem, Paper, Chip } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

// Redux imports
import {
	searchOrders,
	selectOrders,
	selectOrderLoading,
} from 'app/store/slices/order-slices/ordersSlice';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { formatDate } from 'src/utils/dateTime';
import OrdersStatus from '../order/OrdersStatus';

/**
 * Renders a table component for displaying orders.
 *
 * @returns {JSX.Element} The rendered OrdersTable component.
 */
function OrdersTable() {
	// Constants defining the state of the component
	const dispatch = useAppDispatch();
	const data = useAppSelector(selectOrders);
	const isLoading = useAppSelector(selectOrderLoading);

	useEffect(() => {
		dispatch(searchOrders());
	}, [dispatch]);

	// Define the columns for the table
	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'Id',
				size: 30,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/maintenance/orders/${row.original.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.id}
					</Typography>
				),
			},
			{
				id: 'contrato_id',
				header: 'Contrato',
				accessorKey: 'contrato_id',
				size: 64,
				accessorFn: (row) => row.contrato_id || '',
			},
			{
				accessorKey: 'created_time',
				id: 'hace',
				header: 'Hace',
				size: 64,
				Cell: ({ row }) => {
					const createdTime = new Date(row.original.created_time);
					const currentTime = new Date();
					const openedTime = Math.abs(currentTime - createdTime);

					// Convert the opened time to a suitable format
					const days = Math.floor(openedTime / (1000 * 60 * 60 * 24));

					return `${days} días`;
				},
				accessorFn: (row) => {
					const createdTime = new Date(row.created_time);
					const currentTime = new Date();
					const openedTime = Math.abs(currentTime - createdTime);

					// Convert the opened time to a suitable format
					const days = Math.floor(openedTime / (1000 * 60 * 60 * 24));

					return `${days} días`;
				},
			},
			{
				accessorKey: 'created_time',
				id: 'created_time',
				header: 'Creación',
				size: 64,
				Cell: ({ row }) => {
					const createdTime = new Date(row.original.created_time);
					const formattedTime = formatDate(
						createdTime,
						"d 'de' MMMM 'de' yyyy, HH:mm",
					);

					return formattedTime;
				},
				accessorFn: (row) => {
					const createdTime = new Date(row.created_time);

					// Format the created time
					const formattedTime = formatDate(
						createdTime,
						"d 'de' MMMM 'de' yyyy, HH:mm",
					);

					return formattedTime;
				},
			},
			{
				id: 'status',
				accessorKey: 'status',
				header: 'Estado',
				Cell: ({ row }) => <OrdersStatus name={row.original.status} />,
				filterVariant: 'select',
			},
			{
				accessorKey: 'contratista.nombre',
				header: 'Contratista',
				size: 64,
				Cell: ({ row }) => (
					<Typography>{row.original.contratista.nombre}</Typography>
				),
			},
			{
				accessorKey: 'inquilino.nombre',
				header: 'Inquilino',
				size: 64,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/maintenance/inmuebles/${row.original.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.inquilino &&
							row.original.inquilino.nombre}
					</Typography>
				),
			},
			{
				id: 'titulo',
				header: 'Título',
				accessorKey: 'titulo',
				size: 64,
				accessorFn: (row) => row.titulo || '',
			},

			{
				header: 'Propietario',
				accessorKey: 'propietario.nombre',
				size: 64,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/maintenance/inmuebles/${row.original.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.propietario &&
							row.original.propietario.nombre}
					</Typography>
				),
			},
			{
				accessorKey: 'inmueble.direccion',
				header: 'Inmueble',
				size: 64,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/maintenance/inmuebles/${row.original.inmueble_id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.inmueble &&
							row.original.inmueble.direccion}
					</Typography>
				),
			},

			{
				id: 'inmueble.clase',
				accessorKey: 'inmueble.clase',
				header: 'Clase',
				Cell: ({ row }) => (
					<Typography>{row.original.inmueble.clase}</Typography>
				),
				size: 128,
			},

			{
				id: 'tags',
				accessorFn: (row) =>
					row.tags ? row.tags.map((tag) => tag.tags).join(', ') : '',
				header: 'Tags',
				enableGrouping: false,
				Cell: ({ row }) => {
					const isNotEmpty = row.original.tags.some(
						(tag) =>
							tag.tipo !== null ||
							tag.tags !== null ||
							tag.order_id !== null ||
							tag.color !== null,
					);
					return (
						<div className="flex flex-wrap space-x-2">
							{isNotEmpty &&
								row.original.tags.map((tag) => (
									<Chip
										key={tag.tags}
										style={{
											backgroundColor: tag.color,
											color: tag.text_color,
										}}
										size="small"
										label={tag.tags}
									/>
								))}
						</div>
					);
				},
			},
		],
		[],
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-auto rounded-b-0 w-full h-full"
			elevation={0}
		>
			<DataTable
				initialState={{
					density: 'comfortable',
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
								removeOrders(
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
								Eliminar items seleccionados
							</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

export default OrdersTable;
