import i18next from 'i18next';
import es from './navigation-i18n/es';
import en from './navigation-i18n/en';
import appsConfig from './appsConfig';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('es', 'navigation', es);
/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig = [
	{
		id: 'apps',
		title: 'Applications',
		type: 'group',
		icon: 'heroicons-outline:cube',
		translate: 'APPLICATIONS',
		children: [
			{
				id: 'apps.app',
				title: appsConfig.title,
				type: 'collapse',
				icon: 'heroicons-outline:cube',
				children: appsConfig.children.map((app) => ({
					id: app.id,
					title: i18next.t(`navigation:${app.title}`),
					type: 'item',
					url: app.url,
					icon: app.icon,
					end: app.end,
				})),
			},
			{
				id: 'contacts',
				title: 'Usuarios',
				type: 'item',
				icon: 'heroicons-outline:user-group',
				url: '/apps/users',
				end: true,
			},
		],
	},
];
export default navigationConfig;
