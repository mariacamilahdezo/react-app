import _ from '@lodash';

/**
 * Creates a new user object with the specified data.
 */
function UserModel(data) {
	data = data || {};
	return _.defaults(data, {
		uid: null,
		role: null, // guest
		data: {
			displayName: null,
			photoURL: '',
			email: '',
			shortcuts: [],
			settings: {},
			id: null,
			tipo: null,
			nombre: null,
			identificacion: null,
			username: '',
			direccion: null,
			municipio: null,
			barrio: null,
			telefono_res: null,
			telefono_ofi: null,
			celular: null,
			can_login: null,
			is_active: null,
			area_id: null,
		},
	});
}

export default UserModel;

function InmuebleModel(data) {
	data = data || {};
	return _.defaults(data, {
		id: 0,
		nombre: '',
		direccion: '',
		urbanizacion: '',
		municipio: '',
		barrio: '',
		zona: 0,
		telefono: 0,
		clase: '',
	});
}

function ContratoModel(data = {}) {
	return _.defaults(data, {
		id: 0,
		inmueble_id: '',
		inquilino_id: '',
		contrato: '',
		propietario_id: '',
		esta_activo: '',
		contrato_especial: '',
		tipo: '',
		canon: '',
		costo_admin: '',
		perc_comision: '',
		fecha_contrato: '',
		asesor_id: '',
		asesor_auxiliar_id: '',
		duracion_de_contrato: '',
	});
}

function OrdenMantenimientoModel(data = {}) {
	return _.defaults(data, {
		id: null,
		inmueble_id: null,
		inquilino_id: null,
		propietario_id: null,
		status: 'ABIERTA',
		titulo: '',
		descripcion: '',
		contratista_id: null,
		contrato_id: null,
		total_reparacion: null,
		tags: [],
	});
}

function OrdenesMantenimientoTagsModel(data = {}) {
	return _.defaults(data, {
		id: null,
		order_id: null,
		tag: null,
		tipo: null,
	});
}

function ComentariosOrdenesMantenimientoModel(data = {}) {
	return _.defaults(data, {
		id: 0,
		order_id: '',
		author_id: '',
		description: '',
	});
}

function ComentariosInmueblesModel(data = {}) {
	return _.defaults(data, {
		id: null,
		inmueble_id: null,
		author_id: null,
		description: null,
	});
}

function OrdernesMantenimientoArtifactsModel(data = {}) {
	return _.defaults(data, {
		id: 0,
		name: '',
		order_id: 0,
		artifact_url: '',
		created_by: '',
	});
}

export {
	UserModel,
	InmuebleModel,
	ContratoModel,
	OrdenMantenimientoModel,
	OrdenesMantenimientoTagsModel,
	ComentariosOrdenesMantenimientoModel,
	OrdernesMantenimientoArtifactsModel,
	ComentariosInmueblesModel,
};
