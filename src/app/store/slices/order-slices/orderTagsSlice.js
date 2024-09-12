import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// Import the API client instance
import { tagsApi } from 'app/store/apiInstances';
import { OrdenesMantenimientoTagsModel } from '../../initialStates';

// Orders Tags:
export const getOrderTagsById = createAsyncThunk(
	'order/tags/fetchById',
	async (id) => {
		const response = await tagsApi.getMaintenanceTagOrder(id);
		return response.data;
	},
);

export const createNewOrderTags = createAsyncThunk(
	'order/tags/create',
	async (OrderTagsData) => {
		const response = await tagsApi.createOrderTags(OrderTagsData);
		return response.data;
	},
);

export const searchOrderTags = createAsyncThunk(
	'order/tags/search',
	async () => {
		const response = await tagsApi.searchOrderTags();
		return response.data;
	},
);

export const updateOrderTags = createAsyncThunk(
	'order/tags/update',
	async (OrderTagsData) => {
		const response = await tagsApi.updateOrderTags(OrderTagsData);
		return response.data;
	},
);

export const deleteOrderTags = createAsyncThunk(
	'order/tags/delete',
	async (id) => {
		const response = await tagsApi.deleteOrderTags(id);
		return response.data;
	},
);

// Define initial state
const initialState = {
	orderTags: [],
	orderTag: OrdenesMantenimientoTagsModel({}),
	loading: false,
	error: null,
};

// Define the slice
export const orderTagsSlice = createSlice({
	name: 'orderTags',
	initialState,
	reducers: {
		clearOrderTagsState: (state) => {
			state.orderTags = [];
			state.orderTag = null;
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getOrderTagsById.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(getOrderTagsById.fulfilled, (state, action) => {
			state.loading = false;
			state.orderTags = action.payload;
		});
		builder.addCase(getOrderTagsById.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(createNewOrderTags.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(createNewOrderTags.fulfilled, (state, action) => {
			state.loading = false;
			state.orderTag = action.payload;
		});
		builder.addCase(createNewOrderTags.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(searchOrderTags.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(searchOrderTags.fulfilled, (state, action) => {
			state.loading = false;
			state.orderTags = action.payload;
		});
		builder.addCase(searchOrderTags.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

// Export actions and selectors
export const { clearOrderTagsState } = orderTagsSlice.actions;
export const selectOrderTags = (state) => state.orderTags.orderTags;
export const selectOrderTag = (state) => state.orderTags.orderTag;
export const selectOrderTagsLoading = (state) => state.orderTags.loading;
export const selectOrderTagsError = (state) => state.orderTags.error;

// Export the reducer
export default orderTagsSlice.reducer;
