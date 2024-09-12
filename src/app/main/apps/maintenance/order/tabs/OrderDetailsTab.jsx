import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { Chip, Box } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import { Link, useParams } from 'react-router-dom';
import appsConfig from 'app/configs/appsConfig';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import {
	selectOrder,
	selectOrderError,
	getOrderById,
} from 'app/store/slices/order-slices/ordersSlice';
import format from 'date-fns/format';
import _ from '@lodash';
import { useEffect } from 'react';
import OrdersStatus from '../OrdersStatus';

/**
 * The order details tab.
 */
function OrderDetailsTab() {
	const dispatch = useAppDispatch();
	const order = useAppSelector(selectOrder);
	const routeParams = useParams();
	const { orderId } = routeParams;

	useEffect(() => {
		if (!order) {
			dispatch(getOrderById(orderId));
		}
	}, [order]);

	const isError = useAppSelector(selectOrderError);

	if (!isError && !order) {
		return null;
	}

	const keyOrder = [
		'id',
		'inmueble_name',
		'inquilino_name',
		'contratista_name',
		'direccion',
		'municipio',
		'zona',
		'clase',
		'telefono',
	];
	const unwantedKeys = [
		'inquilino_id',
		'status',
		'contratista_id',
		'inmueble_id',
		'created_time',
		'name',
	]; // Replace with the keys you want to exclude
	const labels = Object.keys(order.inmueble)
		.filter((key) => !unwantedKeys.includes(key))
		.sort((a, b) => keyOrder.indexOf(a) - keyOrder.indexOf(b));
	return (
		<div>
			<Grid
				container
				spacing={3}
			>
				{/* ------------ DESCRIPCION ---------------*/}
				<Grid
					xs={12}
					md={12}
				>
					<Box
						border={0.2}
						borderRadius={2}
						p={2}
						bgcolor="background.paper"
						width="100%"
						borderColor="grey.300"
					>
						<Typography variant="h6">Descripción</Typography>
						<Typography>
							{order.descripcion
								? order.descripcion
								: 'Sin asignar'}
						</Typography>
					</Box>
				</Grid>
				{/* ------------ Informacion Base ---------------*/}
				<Grid
					xs={12}
					md={12}
				>
					<div className="pb-10">
						<div className="pb-16 flex items-center">
							<FuseSvgIcon color="action">
								heroicons-outline:clock
							</FuseSvgIcon>
							<Typography
								className="h2 mx-12 font-medium"
								color="text.secondary"
							>
								Estado de la orden
							</Typography>
						</div>

						<div className="table-responsive">
							<Table className="simple">
								<TableHead>
									<TableRow>
										<TableCell>
											<Typography className="font-semibold">
												Estado
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Fecha de creación
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Ultima modificación
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Tags
											</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>
											<OrdersStatus
												name={
													order.status
														? order.status
														: 'Sin asignar'
												}
											/>
										</TableCell>
										<TableCell>
											<Typography
												className="text-13"
												color="text.secondary"
											>
												{format(
													new Date(
														order.created_time,
													),
													'MMM dd, yyyy, h:mm a',
												)}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography
												className="text-13"
												color="text.secondary"
											>
												{order.modified_time
													? format(
															new Date(
																order.modified_time,
															),
															'MMM dd, yyyy, h:mm a',
														)
													: '-'}
											</Typography>
										</TableCell>
										<TableCell>
											{order.tags.map((tag) => (
												<Chip
													key={tag.tags}
													style={{
														backgroundColor:
															tag.color,
														color: tag.text_color,
													}}
													size="small"
													label={tag.tags}
												/>
											))}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</div>
					<div className="pb-10">
						<div className="pb-16 flex items-center">
							<FuseSvgIcon color="action">
								heroicons-outline:user-circle
							</FuseSvgIcon>
							<Typography
								className="h2 mx-12 font-medium"
								color="text.secondary"
							>
								{appsConfig.assets.name_singular}
							</Typography>
						</div>

						{/* <div className="mb-10"> */}
						<div className="table-responsive mb-10">
							<table className="simple">
								<thead>
									<tr>
										{labels.map((label, index) => (
											<th key={index}>
												<Typography className="font-semibold">
													{
														_.startCase(
															label,
														).split(' ')[0]
													}
												</Typography>
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<Typography
												component={Link}
												to={`/apps/maintenance/inmuebles/${order.inmueble_id}`}
												className="underline"
												color="secondary"
												role="button"
											>
												{order.inmueble_id
													? order.inmueble_id
													: 'Sin asignar'}
											</Typography>
										</td>
										<td>
											<div className="flex items-center">
												<FuseSvgIcon color="action">
													heroicons-outline:office-building
												</FuseSvgIcon>
												<Typography className="truncate">
													{order.inmueble.direccion
														? order.inmueble
																.direccion
														: 'Sin asignar'}
												</Typography>
											</div>
										</td>

										<td>
											<Typography className="truncate">
												{order.inmueble.municipio
													? order.inmueble.municipio
													: 'Sin asignar'}
											</Typography>
										</td>
										<td>
											<Typography className="truncate">
												{order.inmueble.zona
													? order.inmueble.zona
													: 'Sin asignar'}
											</Typography>
										</td>
										<td>
											<Typography className="truncate">
												{order.inmueble.clase
													? order.inmueble.clase
													: 'Sin asignar'}
											</Typography>
										</td>
										<td>
											<Typography className="truncate">
												{order.inmueble.telefono
													? order.inmueble.telefono
													: 'Sin asignar'}
											</Typography>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					{/* ------------ INQUILINO ---------------*/}
					<div className="pb-10">
						<div className="pb-16 flex items-center">
							<FuseSvgIcon color="action">
								heroicons-outline:clock
							</FuseSvgIcon>
							<Typography
								className="h2 mx-12 font-medium"
								color="text.secondary"
							>
								Datos del inquilino
							</Typography>
						</div>

						<div className="table-responsive">
							<Table className="simple">
								<TableHead>
									<TableRow>
										<TableCell>
											<Typography className="font-semibold">
												Id
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Nombre
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Email
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Identificación
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Celular
											</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>
											<Typography className="truncate">
												{order.inquilino.id
													? order.inquilino.id
													: 'Sin asignar'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="truncate">
												{order.inquilino.nombre
													? order.inquilino.nombre
													: 'Sin asignar'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="truncate">
												{order.inquilino.email
													? order.inquilino.email
													: 'Sin asignar'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="truncate">
												{order.inquilino.identificacion
													? order.inquilino
															.identificacion
													: 'Sin asignar'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="truncate">
												{order.inquilino.celular
													? order.inquilino.celular
													: 'Sin asignar'}
											</Typography>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</div>
					{/* ------------ PROPIETARIO ---------------*/}
					<div className="pb-10">
						<div className="pb-16 flex items-center">
							<FuseSvgIcon color="action">
								heroicons-outline:clock
							</FuseSvgIcon>
							<Typography
								className="h2 mx-12 font-medium"
								color="text.secondary"
							>
								Datos del propietario
							</Typography>
						</div>

						<div className="table-responsive">
							<Table className="simple">
								<TableHead>
									<TableRow>
										<TableCell>
											<Typography className="font-semibold">
												Id
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Nombre
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Email
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Identificación
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Celular
											</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>
											<Typography className="truncate">
												{order.propietario.id
													? order.propietario.id
													: 'Sin asignar'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="truncate">
												{order.propietario.nombre
													? order.propietario.nombre
													: 'Sin asignar'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="truncate">
												{order.propietario.email
													? order.propietario.email
													: 'Sin asignar'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="truncate">
												{order.propietario
													.identificacion
													? order.propietario
															.identificacion
													: 'Sin asignar'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="truncate">
												{order.propietario.celular
													? order.propietario.celular
													: 'Sin asignar'}
											</Typography>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</div>
					<div className="pb-10">
						<div className="pb-16 flex items-center">
							<FuseSvgIcon color="action">
								heroicons-outline:clock
							</FuseSvgIcon>
							<Typography
								className="h2 mx-12 font-medium"
								color="text.secondary"
							>
								Reparacion/Mantenimiento
							</Typography>
						</div>

						<div className="table-responsive">
							<Table className="simple">
								<TableHead>
									<TableRow>
										<TableCell>
											<Typography className="font-semibold">
												ID Contrato
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Nombre Contratista
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Celular Contratista
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="font-semibold">
												Total Reparacion
											</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>
											<Typography className="truncate">
												{order.contrato_id
													? order.contrato_id
													: 'Sin asignar'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="truncate">
												{order.contratista.nombre
													? order.contratista.nombre
													: 'Sin asignar'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="truncate">
												{order.contratista.celular
													? order.contratista.celular
													: 'Sin asignar'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography className="truncate">
												{order.total_reparacion
													? Intl.NumberFormat('en', {
															style: 'currency',
															currency: 'USD',
														}).format(
															order.total_reparacion,
														)
													: 'Sin asignar'}
											</Typography>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</div>
				</Grid>
			</Grid>
		</div>
	);
}

export default OrderDetailsTab;
