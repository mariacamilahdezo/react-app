import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';

// Redux imports
import { useAppDispatch } from 'app/store/hooks';
import {
	createNewInmueble,
	updateInmueble,
} from 'app/store/slices/inmueble-slice/inmueblesSlice';

/**
 * The asset header.
 */
function AssetHeader() {
	const routeParams = useParams();
	const { assetId } = routeParams;
	const methods = useFormContext();
	const dispatch = useAppDispatch();
	const [isUpdating, setIsUpdating] = useState(false);
	const { formState, watch, getValues, reset } = methods;
	const { isValid, dirtyFields } = formState;
	const theme = useTheme();
	const navigate = useNavigate();
	const { name, direccion, images, featuredImageId } = watch();

	const handleSaveAsset = async () => {
		setIsUpdating(true);
		try {
			const data = await dispatch(
				updateInmueble({ id: assetId, data: getValues() }),
			).unwrap();
			dispatch(
				showMessage({
					message: 'Inmueble actualizado correctamente',
					variant: 'success',
				}),
			);
		} catch (error) {
			dispatch(
				showMessage({
					message: 'No fue posible actualizar el inmueble',
					variant: 'error',
				}),
			);

			console.error('Failed to update inmueble:', error);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleCreateAsset = async () => {
		try {
			const data = await dispatch(
				createNewInmueble(getValues()),
			).unwrap();
			dispatch(
				showMessage({
					message: 'Inmueble creado correctamente',
					variant: 'success',
				}),
			);
			navigate(`/apps/maintenance/inmuebles/${data.id}`);
		} catch (error) {
			dispatch(
				showMessage({
					message: 'No fue posible crear el inmueble',
					variant: 'error',
				}),
			);
			console.error('Failed to create inmueble:', error);
		}
	};

	async function handleRemoveAsset() {
		try {
			await dispatch(removeInmueble(assetId)).unwrap();
			dispatch(
				showMessage({
					message: 'Inmueble eliminado correctamente',
					variant: 'success',
				}),
			);
			navigate('/apps/maintenance/inmuebles');
		} catch (error) {
			dispatch(
				showMessage({
					message: 'No fue posible eliminar el inmueble',
					variant: 'error',
				}),
			);
			console.error('Failed to remove inmueble:', error);
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
						to="/apps/maintenance/inmuebles"
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
							Volver a inmuebles
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
								heroicons-solid:office-building
							</FuseSvgIcon>
						)}
					</motion.div>
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{name || direccion || 'Nuevo Inmueble'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							{assetId === 'new'
								? 'Crear nuevo inmueble'
								: `Detalle del inmueble: ${direccion}`}
						</Typography>
					</motion.div>
				</div>
			</div>
			<motion.div
				className="flex flex-1 w-full"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				{assetId !== 'new' ? (
					<>
						{/* <Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							onClick={handleRemoveAsset}
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
							disabled={
								isUpdating || _.isEmpty(dirtyFields) || !isValid
							}
							onClick={handleSaveAsset}
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
						onClick={handleCreateAsset}
					>
						Añadir
					</Button>
				)}
			</motion.div>
		</div>
	);
}

export default AssetHeader;
