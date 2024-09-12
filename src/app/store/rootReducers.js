import { combineSlices } from '@reduxjs/toolkit';
import { fuseSettingsSlice } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { isMockApi } from 'src/env';
import apiService from './apiService';
import { userSlice } from './slices/user-slices/userSlice';
import { usersSlice } from './slices/user-slices/usersSlice';
import { i18nSlice } from './slices/general-slices/i18nSlice';
import { inmueblesSlice } from './slices/inmueble-slice/inmueblesSlice';
import { basicSlice } from './slices/general-slices/basicSlice';
import { ordersSlice } from './slices/order-slices/ordersSlice';
import { orderCommentsSlice } from './slices/order-slices/orderCommentsSlice';
import { inmuebleCommentsSlice } from './slices/inmueble-slice/inmuebleCommentsSlice';
import { orderTagsSlice } from './slices/order-slices/orderTagsSlice';
import { orderArtifactsSlice } from './slices/order-slices/orderArtifactsSlice';
import { statusesSlice } from './slices/order-slices/orderStatusesSlice';

const dynamicSlices = {};

if (isMockApi) {
	// Include the apiService.reducer when the mock API is used
	dynamicSlices[apiService.reducerPath] = apiService.reducer;
}

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
export const rootReducer = combineSlices(
	/**
	 * Static slices
	 */
	userSlice,
	fuseSettingsSlice,
	i18nSlice,
	inmueblesSlice,
	basicSlice,
	ordersSlice,
	orderCommentsSlice,
	inmuebleCommentsSlice,
	orderTagsSlice,
	usersSlice,
	orderArtifactsSlice,
	statusesSlice,
	/**
	 * Dynamic slices
	 */
	dynamicSlices,
).withLazyLoadedSlices();
