import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import appsConfig from 'app/configs/appsConfig';
import { clearInmueblesState } from 'app/store/slices/inmueble-slice/inmueblesSlice';
import { useAppDispatch } from 'app/store/hooks';

/**
 * The assets header.
 */
function AssetsHeader() {
	const dispatch = useAppDispatch();
	const isMobile = useThemeMediaQuery((theme) =>
		theme.breakpoints.down('lg'),
	);
	const handleReset = () => {
		dispatch(clearInmueblesState());
	};
	return (
		<div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
			<motion.span
				initial={{ x: -20 }}
				animate={{ x: 0, transition: { delay: 0.2 } }}
			>
				<Typography className="text-24 md:text-32 font-extrabold tracking-tight">
					{appsConfig.assets.name}
				</Typography>
			</motion.span>

			<div className="flex flex-1 items-center justify-end space-x-8">
				<motion.div
					className="flex flex-grow-0"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
				>
					<NavLinkAdapter to="/apps/maintenance/inmuebles/new">
						<Button
							className=""
							variant="contained"
							color="secondary"
							size={isMobile ? 'small' : 'medium'}
							onClick={handleReset}
						>
							<FuseSvgIcon size={20}>
								heroicons-outline:plus
							</FuseSvgIcon>
							<span className="mx-4 sm:mx-8">Añadir</span>
						</Button>
					</NavLinkAdapter>
				</motion.div>
			</div>
		</div>
	);
}

export default AssetsHeader;
