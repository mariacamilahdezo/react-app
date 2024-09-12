import { configureStore, createSelector } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import apiService from 'app/store/apiService';
import { isMockApi } from 'src/env'; // Import the isMockApi variable
import { rootReducer } from './rootReducers';
import { dynamicMiddleware } from './middleware';

let middlewares = [dynamicMiddleware];

if (isMockApi) {
	// Use the apiService middleware when the mock API is used
	middlewares = [apiService.middleware, ...middlewares];
}

export const makeStore = (preloadedState) => {
	const store = configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(middlewares),
		preloadedState,
	});

	// configure listeners using the provided defaults
	// optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
	setupListeners(store.dispatch);
	return store;
};

export const store = makeStore();
export const createAppSelector = createSelector.withTypes();
export default store;
