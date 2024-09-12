import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';

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
	const methods = useFormContext();
	const { control, watch } = methods;
	// const images = watch('images');
	const images = watch('images') || [
		{ id: 1, url: '/assets/images/apps/inmuebles/alcoba.jpg' },
		{ id: 2, url: '/assets/images/apps/inmuebles/armario.jpg' },
		{ id: 3, url: '/assets/images/apps/inmuebles/baño.jpg' },
		{ id: 4, url: '/assets/images/apps/inmuebles/closet.jpg' },
		{ id: 5, url: '/assets/images/apps/inmuebles/cocina.jpg' },
		{ id: 6, url: '/assets/images/apps/inmuebles/comoda.jpg' },
		{ id: 7, url: '/assets/images/apps/inmuebles/ropas.jpg' },
		{ id: 8, url: '/assets/images/apps/inmuebles/sanitario.jpg' },
		{ id: 9, url: '/assets/images/apps/inmuebles/vestier.jpg' },
		// Add more image objects as needed
	];

	return (
		<Root>
			<div className="flex justify-center sm:justify-start flex-wrap -mx-16">
				<Controller
					name="images"
					control={control}
					render={({ field: { onChange, value } }) => (
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
							className="assetImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
						>
							<input
								accept="image/*"
								className="hidden"
								id="button-file"
								type="file"
								onChange={async (e) => {
									function readFileAsync() {
										return new Promise(
											(resolve, reject) => {
												const file =
													e?.target?.files?.[0];

												if (!file) {
													return;
												}

												const reader = new FileReader();
												reader.onload = () => {
													resolve({
														id: FuseUtils.generateGUID(),
														url: `data:${file.type};base64,${btoa(reader.result)}`,
														type: 'image',
													});
												};
												reader.onerror = reject;
												reader.readAsBinaryString(file);
											},
										);
									}

									const newImage = await readFileAsync();
									onChange([newImage, ...value]);
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
										onClick={() => onChange(media.id)}
										onKeyDown={() => onChange(media.id)}
										role="button"
										tabIndex={0}
										className={clsx(
											'assetImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg',
											media.id === value && 'featured',
										)}
										key={media.id}
									>
										<FuseSvgIcon className="assetImageFeaturedStar">
											heroicons-solid:star
										</FuseSvgIcon>
										<img
											className="max-w-none w-auto h-full"
											src={media.url}
											alt="asset"
										/>
									</div>
								))}
							</>
						);
					}}
				/>
			</div>
		</Root>
	);
}

export default AssetImagesTab;
