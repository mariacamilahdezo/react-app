import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import appsConfig from 'app/configs/appsConfig';
import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { clearOrdersState } from 'app/store/slices/order-slices/ordersSlice';
import { useAppDispatch } from 'app/store/hooks';

/**
 * The orders header.
 */
function OrdersHeader() {
	const dispatch = useAppDispatch();
	const isMobile = useThemeMediaQuery((theme) =>
		theme.breakpoints.down('lg'),
	);
	const handleReset = () => {
		dispatch(clearOrdersState());
	};
	return (
		<div className="flex space-y-10 sm:space-y-0 flex-1 w-full items-center justify-between py-2 sm:py-2 px-10 md:px-24 over">
			<motion.span
				initial={{ x: -20 }}
				animate={{
					x: 0,
					transition: { delay: 0.2 },
				}}
			>
				<Typography className="flex text-20 md:text-28 font-extrabold tracking-tight">
					Órdenes de {appsConfig.ordersType.mantenimiento}
				</Typography>
			</motion.span>

			<div className="flex flex-1 items-center justify-end space-x-8">
				<motion.div
					className="flex flex-grow-0"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
				>
					<NavLinkAdapter to="/apps/maintenance/orders/new">
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

export default OrdersHeader;
