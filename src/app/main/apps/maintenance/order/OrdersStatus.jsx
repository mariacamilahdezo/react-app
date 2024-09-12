import _ from '@lodash';
import clsx from 'clsx';
/**
 * The order statuses.
 */
export const orderStatuses = [
	{
		id: 1,
		name: 'ABIERTA',
		color: 'bg-green text-white',
		colorText: 'text-green-600',
	},
	{
		id: 2,
		name: 'PENDIENTE',
		color: 'bg-yellow text-white',
		colorText: 'text-yellow-600',
	},
	{
		id: 3,
		name: 'PENDIENTE CONTRATISTA',
		color: 'bg-pink text-white',
		colorText: 'text-pink-600',
	},
	{
		id: 4,
		name: 'PENDIENTE PROPIETARIO',
		color: 'bg-orange text-white',
		colorText: 'text-orange-600',
	},
	{
		id: 5,
		name: 'EJECUCIÓN',
		color: 'bg-blue text-white',
		colorText: 'text-blue-600',
	},
	{
		id: 6,
		name: 'REPROGRAMADA',
		color: 'bg-purple text-white',
		colorText: 'text-purple-600',
	},
	{
		id: 7,
		name: 'CERRADA',
		color: 'bg-red text-white',
		colorText: 'text-red-600',
	},
	{
		id: 8,
		name: 'CANCELADA',
		color: 'bg-gray text-white',
		colorText: 'text-gray-600',
	},
];

/**
 * The orders status component.
 */
function OrdersStatus(props) {
	const { name } = props;
	return (
		<div
			className={clsx(
				'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
				_.find(orderStatuses, { name })?.color,
			)}
		>
			{name}
		</div>
	);
}

export default OrdersStatus;
