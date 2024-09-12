const appsConfig = {
	owner: 'Pymtech',
	title: 'Mantenimiento',
	assets: {
		name: 'Inmuebles',
		name_singular: 'Inmueble',
	},
	stakeHolders: {
		stakeHolderIn: 'Propietario',
		stakeHolderOut: 'Inquilino',
		StakeHolder: 'Usuario',
	},
	ordersType: {
		mantenimiento: 'mantenimiento',
	},
	locale: {
		languageId: 'spanish',
		locale: 'es',
		name: 'Español',
		icon: 'es',
	},
	children: [
		{
			id: 'maintenance-assets',
			title: 'Inmuebles',
			type: 'item',
			url: '/apps/maintenance/inmuebles',
			icon: 'heroicons-outline:home',
			end: true,
		},
		{
			id: 'maintenance-orders',
			title: 'Órdenes',
			type: 'item',
			url: '/apps/maintenance/orders',
			icon: 'heroicons-outline:clipboard-list',
			end: true,
		},
	],
};
export default appsConfig;
