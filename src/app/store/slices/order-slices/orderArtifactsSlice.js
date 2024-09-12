import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// Import the API client instance
import { artifactsApi } from 'app/store/apiInstances';
import { OrdernesMantenimientoArtifactsModel } from '../../initialStates';

// Async thunk for fetching a specific order artifact by ID
export const getOrderArtifactsById = createAsyncThunk(
	'order/artifacts/fetchById',
	async (id) => {
		const response = await artifactsApi.getFiles(id); // Call the API client method
		return response.data;
	},
);

// Async thunk for fetching a specific order artifact by ID
export const uploadOrderArtifactsById = createAsyncThunk(
	'order/artifacts/upload',
	async (orderArtifactUpload) => {
		const response = await artifactsApi.uploadFile(orderArtifactUpload);
		return response.data;
	},
);

// Define initial state
const initialState = {
	orderArtifacts: [], // Array of order artifacts
	orderArtifact: OrdernesMantenimientoArtifactsModel({}),
	loading: false,
	error: null,
};

// Define the slice
export const orderArtifactsSlice = createSlice({
	name: 'orderArtifacts',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getOrderArtifactsById.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(getOrderArtifactsById.fulfilled, (state, action) => {
			state.loading = false;
			state.orderArtifacts = action.payload;
		});
		builder.addCase(getOrderArtifactsById.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

// Export actions and selectors
export const selectOrderArtifacts = (state) =>
	state.orderArtifacts.orderArtifacts; // Select the orderArtifacts array
export const selectOrderArtifactsLoading = (state) =>
	state.orderArtifacts.loading;
export const selectOrderArtifactsError = (state) => state.orderArtifacts.error;

// Export the reducer
export default orderArtifactsSlice.reducer;
