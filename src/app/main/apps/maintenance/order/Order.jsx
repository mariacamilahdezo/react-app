// Fuse and funciontality imports
import React from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseLoading from '@fuse/core/FuseLoading';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from '@lodash';

// React imports and components
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { OrdenMantenimientoModel } from 'app/store/initialStates';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import {
	selectOrder,
	getOrderById,
	selectOrderLoading,
	selectOrderError,
} from 'app/store/slices/order-slices/ordersSlice';
import OrderHeader from './OrderHeader';

// Redux imports

/**
 * Form Validation Schema
 */
const schema = z.object({
	titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
	descripcion: z
		.string()
		.nonempty('Debes ingresar una descripción para la orden')
		.min(5, 'La descripción debe tener al menos 5 caracteres'),
	status: z.string().min(1, 'Debes seleccionar un estado para la orden'),
	tags: z.any().nullish(),
	contratista_id: z.number().nullish(),
	contrato_id: z
		.number({ required_error: 'Debes seleccionar un Contrato' })
		.int(),
	inquilino_id: z
		.number({ required_error: 'Debes seleccionar un Inquilino' })
		.int(),
	propietario_id: z
		.number({ required_error: 'Debes seleccionar un Propietario' })
		.int(),
	inmueble_id: z
		.number({ required_error: 'Debes seleccionar un Inmueble' })
		.int(),
	total_reparacion: z
		.number()
		.optional()
		.nullable()
		.transform((val) => {
			if (val === '') {
				return null;
			}

			return val;
		}),
});

// Tabs imports and components lazy loading
const BasicInfoTab = React.lazy(() => import('./tabs/BasicInfoTab'));
const CommentsHandler = React.lazy(
	() => import('./tabs/comments/CommentsHandler'),
);
const OrderImagesTab = React.lazy(() => import('./tabs/OrderImagesTab'));
const OrderDetailsTab = React.lazy(() => import('./tabs/OrderDetailsTab'));
const Templates = React.lazy(() => import('./tabs/Templates'));

/**
 * The order.
 */
function Order() {
	const isMobile = useThemeMediaQuery((theme) =>
		theme.breakpoints.down('lg'),
	);
	const dispatch = useAppDispatch();
	const routeParams = useParams();
	const { orderId } = routeParams;
	const [tabValue, setTabValue] = useState(0);
	const isCreatingNewOrder = orderId === 'new';

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: isCreatingNewOrder ? zodResolver(schema) : undefined,
	});
	const { reset, watch } = methods;
	const form = watch();

	useEffect(() => {
		if (orderId && orderId !== 'new') {
			dispatch(getOrderById(orderId));
		}
	}, [dispatch, orderId]);

	const order = useAppSelector(selectOrder);
	const isLoading = useAppSelector(selectOrderLoading);
	const isError = useAppSelector(selectOrderError);

	useEffect(() => {
		if (order) {
			reset({ ...order });
		} else if (isCreatingNewOrder) {
			// Default values for new order
			reset(OrdenMantenimientoModel({}));
		}
	}, [orderId, reset, order]);

	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError && orderId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					No existe esa orden!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/apps/maintenance/orders"
					color="inherit"
				>
					¡Dirígete a la pagina de órdenes!
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while order data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(order &&
			routeParams.orderId !== 'new' &&
			order.id &&
			routeParams.orderId !== order.id.toString())
	) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<OrderHeader />}
				content={
					<div>
						{orderId === 'new' ? (
							<>
								{/* ---------- New Order ----------  */}
								<Tabs
									value={tabValue}
									onChange={handleTabChange}
									scrollButtons={false}
									allowScrollButtonsMobile
									selectionFollowsFocus
									aria-label="scrollable force tabs example"
									classes={{ root: 'w-full h-64 border-b-1' }}
								>
									<Tab
										className="h-64"
										label="Detalles de la orden"
									/>
									{/* <Tab
										className="h-64"
										label="Fotos"
									/> */}
								</Tabs>
								<div className="p-16 sm:p-24 max-w-3xl">
									<div
										className={
											tabValue !== 0 ? 'hidden' : ''
										}
									>
										<BasicInfoTab />
									</div>

									{/* <div
										className={
											tabValue !== 1 ? 'hidden' : ''
										}
									>
										<OrderImagesTab />
									</div> */}
								</div>
							</>
						) : (
							<>
								{/* ---------- Existing Order ----------  */}
								<Tabs
									value={tabValue}
									onChange={handleTabChange}
									scrollButtons={false}
									allowScrollButtonsMobile
									selectionFollowsFocus
									aria-label="scrollable force tabs example"
									classes={{ root: 'w-full h-64 border-b-1' }}
								>
									<Tab
										className="h-64"
										label="Detalles de la orden"
									/>
									<Tab
										className="h-64"
										label="Fotos / Videos"
									/>
									<Tab
										className="h-64"
										label="Comentarios"
									/>
									<Tab
										className="h-64"
										label="Templates"
									/>
									<Tab
										className="h-64"
										label="Modificar orden"
									/>
								</Tabs>
								<React.Suspense fallback={<FuseLoading />}>
									<div className="m-32 p-24 sm:p-24 max-w-3xl">
										{tabValue === 0 && (
											<OrderDetailsTab
												orderId={orderId}
											/>
										)}
										{tabValue === 1 && <OrderImagesTab />}
										{tabValue === 2 && (
											<CommentsHandler
												orderId={orderId}
											/>
										)}
										{tabValue === 3 && (
											<Templates orderId={orderId} />
										)}
										{tabValue === 4 && <BasicInfoTab />}
									</div>
								</React.Suspense>
							</>
						)}
					</div>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Order;
