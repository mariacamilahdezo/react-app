import { useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import {
	searchStatuses,
	selectStatusAggregates,
	selectStatusesLoading,
} from 'app/store/slices/order-slices/orderStatusesSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import { Paper, Typography } from '@mui/material';
import { orderStatuses } from 'src/app/main/apps/maintenance/order/OrdersStatus';

function HomeSummary() {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(searchStatuses());
	}, [dispatch]);
	const statuses = useAppSelector(selectStatusAggregates);
	const isLoading = useAppSelector(selectStatusesLoading);

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04,
			},
		},
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	let sortedStatuses = [];

	// Convert orderStatuses to an object
	const orderStatusesObj = orderStatuses.reduce((obj, status) => {
		obj[status.name] = status;
		return obj;
	}, {});

	// Now you can access the id of a status by its name
	if (statuses) {
		sortedStatuses = [...statuses].sort((a, b) => {
			const aStatus = orderStatusesObj[a.status]?.id || 100;
			const bStatus = orderStatusesObj[b.status]?.id || 100;
			return aStatus - bStatus;
		});
	}

	return (
		<motion.div
			className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 w-full sm:gap-y-0 gap-5 min-w-0 px-12 pb-2 pt-8"
			variants={container}
			initial="hidden"
			animate="show"
		>
			{sortedStatuses &&
				sortedStatuses.map((status) => {
					const matchingOrderStatus = orderStatuses.find(
						(orderStatus) => orderStatus.name === status.status,
					);
					const statusColor = matchingOrderStatus
						? matchingOrderStatus.colorText
						: '';

					return (
						<Paper
							key={status.status}
							className={`flex flex-col flex-auto shadow rounded-2xl overflow-hidden mb-10 ${statusColor}`}
						>
							<div className="text-center mt-8 mb-10">
								<Typography className="text-2xl sm:text-6xl font-bold tracking-tight leading-none">
									{status.count}
								</Typography>

								<Typography className="text-base font-medium ">
									{status.status}
								</Typography>
							</div>
						</Paper>
					);
				})}
		</motion.div>
	);
}

export default memo(HomeSummary);
