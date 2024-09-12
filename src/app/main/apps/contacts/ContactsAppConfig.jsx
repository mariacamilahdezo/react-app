import { lazy } from 'react';
import authRoles from '../../../auth/authRoles';

const ContactsApp = lazy(() => import('./ContactsApp'));
/**
 * The ContactsApp configuration.
 */
const ContactsAppConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	auth: authRoles.admin, // ['admin']
	routes: [
		{
			path: 'apps/users',
			element: <ContactsApp />,
		},
	],
};
export default ContactsAppConfig;
