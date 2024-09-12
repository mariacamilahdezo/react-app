import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
import clsx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { useEffect, useState } from 'react';
import {
	getOrderArtifactsById,
	selectOrderArtifacts,
} from 'app/store/slices/order-slices/orderArtifactsSlice';
import { artifactsApi } from 'app/store/apiInstances';
import { Dialog } from '@mui/material';
import { useParams } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';

const Root = styled('div')(({ theme }) => ({
	'& .assetImageFeaturedStar': {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0,
	},
	'& .assetImageUpload': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
	},
	'& .assetImageItem': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& .assetImageFeaturedStar': {
				opacity: 0.8,
			},
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& .assetImageFeaturedStar': {
				opacity: 1,
			},
			'&:hover .assetImageFeaturedStar': {
				opacity: 1,
			},
		},
	},
}));

/**
 * The asset images tab.
 */
function AssetImagesTab() {
	const dispatch = useAppDispatch();
	const methods = useFormContext();
	const { control, watch } = methods;
	const orderArtifacts = useAppSelector(selectOrderArtifacts);
	const routeParams = useParams();
	const { orderId } = routeParams;
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [isLoadingResponseArtifacts, setIsLoadingResponseArtifacts] =
		useState(false);

	useEffect(() => {
		if (orderId) {
			dispatch(getOrderArtifactsById(orderId));
		}
	}, [dispatch, orderId]);

	const images = watch('images') || orderArtifacts;

	if (isLoadingResponseArtifacts) {
		return <FuseLoading />;
	}

	return (
		<Root>
			<div className="flex justify-center sm:justify-start flex-wrap -mx-16">
				<Controller
					name="images"
					control={control}
					render={({ field: { onChange } }) => (
						<Box
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? lighten(
												theme.palette.background
													.default,
												0.4,
											)
										: lighten(
												theme.palette.background
													.default,
												0.02,
											),
							}}
							component="label"
							htmlFor="button-file"
							className="assetImageUpload flex items-center justify-center relative w-200 h-200 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
						>
							<input
								accept="image/*,video/*"
								className="hidden"
								id="button-file"
								type="file"
								onChange={async (e) => {
									const file = e.target.files[0];

									if (!file) {
										return;
									}

									const newImage = {
										name: file.name,
										file,
										order_id: orderId,
									};

									// Make API call to save the image
									let response;
									setIsLoadingResponseArtifacts(true);
									try {
										response = await artifactsApi.uploadFile(
											newImage.order_id,
											newImage.name,
											newImage.file,
										);
										// handle the response here
									} catch (error) {
										dispatch(
											showMessage({
												message:
													'No se pudo cargar el archivo',
												variant: 'error',
											}),
										);
									} finally {
										setIsLoadingResponseArtifacts(false);
									}

									// Update the state with the saved image
									if (response) {
										onChange([response.data, ...images]);

										dispatch(
											showMessage({
												message:
													'Archivo cargado correctamente',
												variant: 'success',
											}),
										);
									}
								}}
							/>
							<FuseSvgIcon
								size={32}
								color="action"
							>
								heroicons-outline:upload
							</FuseSvgIcon>
						</Box>
					)}
				/>
				<Controller
					name="featuredImageId"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => {
						return (
							<>
								{images.map((media) => (
									<div
										onClick={() => {
											setSelectedImage(media);
											setOpenDialog(true);
										}}
										onKeyDown={() => onChange(media.id)}
										role="button"
										tabIndex={0}
										className={clsx(
											'assetImageItem flex items-center justify-center relative w-200 h-200 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg',
											media.id === value && 'featured',
										)}
										key={media.name}
									>
										<FuseSvgIcon className="assetImageFeaturedStar">
											heroicons-solid:star
										</FuseSvgIcon>
										{[
											'video/mp4',
											'video/mov',
											'video/ogg',
											'video/quicktime',
										].some((ext) => media.tipo === ext) ? (
											<video
												className="max-w-none w-auto h-full"
												controls
												muted={true}
												autoPlay={false}
											>
												<source
													src={media.artifact_url}
													type={media.tipo}
												/>
												<track
													kind="captions"
													src="captions.vtt"
													srcLang="en"
													label="English"
												/>
											</video>
										) : (
											<img
												className="max-w-none w-auto h-full"
												src={media.artifact_url}
												alt="asset"
											/>
										)}
									</div>
								))}
								{selectedImage && (
									<Dialog
										open={openDialog}
										onClose={() => setOpenDialog(false)}
										maxWidth="md"
									>
										{[
											'video/mp4',
											'video/mov',
											'video/ogg',
											'video/quicktime',
										].some(
											(ext) => selectedImage.tipo === ext,
										) ? (
											<video
												className="max-w-none w-auto"
												alt="Selected"
												controls
												style={{
													maxHeight: '80vh',
												}}
											>
												<source
													src={
														selectedImage.artifact_url
													}
													type={selectedImage.tipo}
												/>
												<track
													kind="captions"
													src="captions.vtt"
													srcLang="en"
													label="English"
												/>
											</video>
										) : (
											<img
												className="max-w-none w-auto"
												src={selectedImage.artifact_url}
												alt="Selected"
												style={{
													maxHeight: '80vh',
												}}
											/>
										)}
										{/* <img
										src={selectedImage}
										alt="Selected"
										style={{
											maxWidth: '100%',
											maxHeight: '100%',
										}}
									/> */}
									</Dialog>
								)}
							</>
						);
					}}
				/>
			</div>
		</Root>
	);
}

export default AssetImagesTab;
