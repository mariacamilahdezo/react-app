import {
	BasicApi,
	CommentsApi,
	UsersApi,
	AuthenticationApi,
	ContratosApi,
	InmueblesApi,
	MaintenanceOrdersApi,
	FilesApi,
	TagsApi,
} from 'eisa-api-client'; // Import your custom BasicApi client library
import { apiUrl, isMockApi } from 'src/env';
import { config, axiosInstance } from './config'; // Import your API client configuration

const ordersApi =
	isMockApi === 'true'
		? new MaintenanceOrdersApi(true)
		: new MaintenanceOrdersApi(config, apiUrl, axiosInstance);

const basicApi = new BasicApi(config, apiUrl, axiosInstance);

const commentsApi = new CommentsApi(config, apiUrl, axiosInstance);

const userApi =
	isMockApi === 'true'
		? new UsersApi(true)
		: new UsersApi(config, apiUrl, axiosInstance);

const loginApi =
	isMockApi === 'true'
		? new AuthenticationApi(true)
		: new AuthenticationApi(config, apiUrl, axiosInstance);

const contratosApi =
	isMockApi === 'true'
		? new ContratosApi(true)
		: new ContratosApi(config, apiUrl, axiosInstance);

const inmueblesApi =
	isMockApi === 'true'
		? new InmueblesApi(true)
		: new InmueblesApi(config, apiUrl, axiosInstance);

const artifactsApi =
	isMockApi === 'true'
		? new FilesApi(true)
		: new FilesApi(config, apiUrl, axiosInstance);

const tagsApi =
	isMockApi === 'true'
		? new TagsApi(true)
		: new TagsApi(config, apiUrl, axiosInstance);

export {
	basicApi,
	commentsApi,
	userApi,
	loginApi,
	contratosApi,
	inmueblesApi,
	ordersApi,
	artifactsApi,
	tagsApi,
};
