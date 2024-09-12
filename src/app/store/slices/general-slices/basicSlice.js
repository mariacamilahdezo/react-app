import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// Import the API client instance
import { basicApi } from 'app/store/apiInstances';

// Async thunk for pinging the server
export const pingServer = createAsyncThunk('basic/ping', async () => {
	const response = await basicApi.pong(); // Call the API client method
	return response.data;
});

// Async thunk for testing a template
export const testTemplate = createAsyncThunk(
	'basic/templateTest',
	async (templateData) => {
		const response = await basicApi.templateTest(templateData); // Call the API client method
		return response.data;
	},
);

// Define initial state
const initialState = {
	pingResponse: null,
	templateResponse: null,
	loading: false,
	error: null,
};

// Define the slice
export const basicSlice = createSlice({
	name: 'basic',
	initialState,
	reducers: {
		clearBasicState: (state) => {
			state.pingResponse = null;
			state.templateResponse = null;
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(pingServer.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(pingServer.fulfilled, (state, action) => {
			state.loading = false;
			state.pingResponse = action.payload;
		});
		builder.addCase(pingServer.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(testTemplate.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(testTemplate.fulfilled, (state, action) => {
			state.loading = false;
			state.templateResponse = action.payload;
		});
		builder.addCase(testTemplate.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

// Export actions and selectors
export const { clearBasicState } = basicSlice.actions;
export const selectPingResponse = (state) => state.basic.pingResponse;
export const selectTemplateResponse = (state) => state.basic.templateResponse;
export const selectBasicLoading = (state) => state.basic.loading;
export const selectBasicError = (state) => state.basic.error;

// Export the reducer
export default basicSlice.reducer;
