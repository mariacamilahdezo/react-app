import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import authRoles from 'src/app/auth/authRoles';

const MaintenanceApp = lazy(() => import('./MaintenanceApp'));
const Asset = lazy(() => import('./asset/Asset'));
const Assets = lazy(() => import('./assets/Assets'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));

/**
 * The Maintenance app configuration.
 */
const MaintenanceAppConfig = {
	settings: {
		layout: {},
	},
	auth: authRoles.admin,
	routes: [
		{
			path: 'apps/maintenance',
			element: <MaintenanceApp />,
			children: [
				{
					path: '',
					element: <Navigate to="inmuebles" />,
				},
				{
					path: 'inmuebles',
					element: <Assets />,
				},
				{
					path: 'inmuebles/:assetId/*',
					element: <Asset />,
				},
				{
					path: 'orders',
					element: <Orders />,
				},
				{
					path: 'orders/:orderId',
					element: <Order />,
				},
			],
		},
	],
};
export default MaintenanceAppConfig;
