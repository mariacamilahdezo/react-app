import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Import the API client instance
import { ordersApi } from 'app/store/apiInstances';

export const searchStatuses = createAsyncThunk(
	'orders/statusAggregates',
	async () => {
		const response = await ordersApi.getMaintenanceOrderStatusAggregates(); // Call the API client method
		return response.data;
	},
);

// Initial state
const initialState = {
	statusAggregates: [],
};

// Slice
export const statusesSlice = createSlice({
	name: 'statuses',
	initialState,
	reducers: {
		clearOrdersState: (state) => {
			state.statuses = [];
			state.status = null;
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(searchStatuses.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(searchStatuses.fulfilled, (state, action) => {
			state.loading = false;
			state.statuses = action.payload;
		});
		builder.addCase(searchStatuses.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

// Export actions and selectors
export const { clearOrdersState } = statusesSlice.actions;
export const selectStatusAggregates = (state) => state.statuses.statuses;
export const selectStatusesLoading = (state) => state.statuses.loading;
export const selectStatusesError = (state) => state.statuses.error;

// Export the reducer
export default statusesSlice.reducer;
