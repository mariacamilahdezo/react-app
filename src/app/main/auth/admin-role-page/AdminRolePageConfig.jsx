import AdminRolePage from './AdminRolePage';
import authRoles from '../../../auth/authRoles';
/**
 * The AdminRolePageConfig object is a configuration object for the AdminRolePage page in the Fuse application.
 */
const AdminRolePageConfig = {
	settings: {
		layout: {
			config: {},
		},
	},
	auth: authRoles.admin, // ['admin']
	routes: [
		{
			path: '/',
			element: <AdminRolePage />,
		},
	],
};
export default AdminRolePageConfig;
