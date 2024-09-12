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
import { InmuebleModel } from 'app/store/initialStates';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import {
	selectInmueble,
	getInmuebleById,
	selectInmuebleLoading,
	selectInmuebleError,
} from 'app/store/slices/inmueble-slice/inmueblesSlice';
import AssetHeader from './AssetHeader';

// Form Validation Schema
const schema = z.object({
	direccion: z
		.string()
		.nonempty('Debes ingresar una dirección')
		.min(10, 'La dirección debe tener al menos 10 caracteres'),
	municipio: z.string().nonempty('Debes ingresar un municipio'),
});

// Tabs imports and components lazy loading
const BasicInfoTab = React.lazy(() => import('./tabs/BasicInfoTab'));
const CommentsHandler = React.lazy(
	() => import('./tabs/comments/CommentsHandler'),
);

/**
 * The asset page.
 */
function Asset() {
	const isMobile = useThemeMediaQuery((theme) =>
		theme.breakpoints.down('lg'),
	);
	const dispatch = useAppDispatch();
	const routeParams = useParams();
	const { assetId } = routeParams;
	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: zodResolver(schema),
	});
	const { reset, watch } = methods;
	const form = watch();

	useEffect(() => {
		if (assetId && assetId !== 'new') {
			dispatch(getInmuebleById(assetId));
		}
	}, [dispatch, assetId]);

	const asset = useAppSelector(selectInmueble);
	const isLoading = useAppSelector(selectInmuebleLoading);
	const isError = useAppSelector(selectInmuebleError);

	useEffect(() => {
		if (assetId === 'new') {
			reset(InmuebleModel({}));
		}
	}, [assetId, reset]);

	useEffect(() => {
		if (asset) {
			reset({ ...asset });
		}
	}, [asset, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	/**
	 * Show Message if the requested assets is not exists
	 */
	if (isError && assetId !== 'new') {
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
					No existe ese inmueble!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/apps/maintenance/inmuebles"
					color="inherit"
				>
					¡Dirígete a la pagina de inmuebles!
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while asset data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(asset &&
			routeParams.assetId !== asset.id.toString() &&
			routeParams.assetId !== 'new')
	) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<AssetHeader />}
				content={
					<div>
						{assetId === 'new' ? (
							<>
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
										label="Inmueble a crear"
									/>
									<Tab
										className="h-64"
										label="Fotos / archivos"
									/>
									{/* Add more tabs as needed */}
								</Tabs>
								<div className="p-16 sm:p-24 max-w-3xl">
									<div
										className={
											tabValue !== 0 ? 'hidden' : ''
										}
									>
										<BasicInfoTab />
									</div>
								</div>
							</>
						) : (
							<>
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
										label="Información básica"
									/>
									<Tab
										className="h-64"
										label="Comentarios"
									/>
								</Tabs>
								<React.Suspense
									fallback={<div>Loading...</div>}
								>
									<div className="p-16 sm:p-24 max-w-3xl">
										{tabValue === 0 && <BasicInfoTab />}
										{tabValue === 1 && (
											<CommentsHandler
												assetId={assetId}
											/>
										)}
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

export default Asset;
