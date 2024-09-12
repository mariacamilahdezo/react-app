import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';

// Redux imports
import { useAppDispatch } from 'app/store/hooks';
import {
	updateOrder,
	createNewOrder,
} from 'app/store/slices/order-slices/ordersSlice';

/**
 * The order header.
 */
function OrderHeader() {
	const routeParams = useParams();
	const { orderId } = routeParams;
	const methods = useFormContext();
	const dispatch = useAppDispatch();
	const { formState, watch, getValues, reset, handleSubmit } = methods;
	const { isValid, dirtyFields } = formState;
	const theme = useTheme();
	const navigate = useNavigate();
	const { name, titulo, images, featuredImageId } = watch();
	const dirtyFieldsKeys = Object.keys(dirtyFields);

	const formatFieldName = (fieldName) => {
		let cleanName = fieldName.replace(/_id$/, ''); // Remove '_id' if present
		cleanName = cleanName.replace(/_/g, ' '); // Replace underscores with spaces
		return cleanName.charAt(0).toUpperCase() + cleanName.slice(1); // Capitalize the first letter
	};

	const handleSaveOrder = async (values) => {
		try {
			const dataObject = _.pick(getValues(), dirtyFieldsKeys);
			const data = await dispatch(
				updateOrder({ id: orderId, data: dataObject }),
			).unwrap();
			const updatedFields = dirtyFieldsKeys.map(formatFieldName);
			dispatch(
				showMessage({
					message: `Orden actualizada correctamente en los campos: ${updatedFields.join(
						', ',
					)}`,
					variant: 'success',
				}),
			);
			reset();
			navigate(`/apps/maintenance/orders/${orderId}`);
		} catch (error) {
			dispatch(
				showMessage({
					message: 'No fue posible actualizar la orden',
					variant: 'error',
				}),
			);
			console.error('Failed to update order:', error);
		}
	};

	const handleCreateOrder = async (values) => {
		try {
			const data = await dispatch(createNewOrder(values)).unwrap();
			dispatch(
				showMessage({
					message: 'Orden creada correctamente',
					variant: 'success',
				}),
			);
			navigate(`/apps/maintenance/orders/${data.id}`);
		} catch (error) {
			dispatch(
				showMessage({
					message: 'No fue posible crear la orden',
					variant: 'error',
				}),
			);
		}
	};

	async function handleRemoveOrder() {
		try {
			await dispatch(removeOrder(orderId)).unwrap();
			dispatch(
				showMessage({
					message: 'Orden eliminada correctamente',
					variant: 'success',
				}),
			);
			navigate('/apps/maintenance/orders');
		} catch (error) {
			dispatch(
				showMessage({
					message: 'No fue posible eliminar la orden',
					variant: 'error',
				}),
			);
		}
	}

	return (
		<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
			<div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/apps/maintenance/orders"
						color="inherit"
					>
						<FuseSvgIcon
							size={20}
							className="bg-white rounded-4"
							color="secondary"
						>
							{theme.direction === 'ltr'
								? 'heroicons-solid:arrow-sm-left'
								: 'heroicons-solid:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">
							Volver a órdenes
						</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						{images && images.length > 0 && featuredImageId ? (
							<img
								className="w-32 sm:w-48 rounded"
								src={
									_.find(images, { id: featuredImageId })?.url
								}
								alt={name}
							/>
						) : (
							<FuseSvgIcon className="hidden sm:flex">
								heroicons-solid:paper-clip
							</FuseSvgIcon>
						)}
					</motion.div>
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{titulo ||
								(orderId !== 'new' && `Orden #${orderId}`) ||
								'Nueva Orden'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							{orderId !== 'new'
								? `Orden #${orderId}`
								: 'Nueva Orden'}
						</Typography>
					</motion.div>
				</div>
			</div>
			<motion.div
				className="flex flex-1 w-full"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				{orderId !== 'new' ? (
					<>
						{/* <Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							onClick={handleRemoveOrder}
							startIcon={
								<FuseSvgIcon className="hidden sm:flex">
									heroicons-outline:trash
								</FuseSvgIcon>
							}
						>
							Eliminar
						</Button> */}
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							onClick={handleSubmit(handleSaveOrder)}
						>
							Guardar
						</Button>
					</>
				) : (
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						onClick={handleSubmit(handleCreateOrder)}
					>
						Añadir
					</Button>
				)}
			</motion.div>
		</div>
	);
}

export default OrderHeader;
