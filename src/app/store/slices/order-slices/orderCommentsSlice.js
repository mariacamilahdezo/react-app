import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// Import the API client instance
import { commentsApi } from 'app/store/apiInstances';
import { ComentariosOrdenesMantenimientoModel } from '../../initialStates';

// Orders Comments:

export const getOrderCommentsById = createAsyncThunk(
	'order/comments/fetchById',
	async (id) => {
		const response = await commentsApi.getOrderComments(id); // Call the API client method
		return response.data;
	},
);

// Async thunk for creating a new order
export const createNewOrderComments = createAsyncThunk(
	'order/comments/create',
	async (OrderCommentsData) => {
		const response =
			await commentsApi.createOrderComments(OrderCommentsData); // Call the API client method
		return response.data;
	},
);

// Async thunk for searching order
export const searchOrderComments = createAsyncThunk(
	'order/commentss/search',
	async () => {
		const response = await commentsApi.searchOrderComments(); // Call the API client method
		return response.data;
	},
);

// Async thunk for updating a new order
export const updateOrderComments = createAsyncThunk(
	'order/comments/update',
	async (OrderCommentsData) => {
		const response =
			await commentsApi.updateOrderComments(OrderCommentsData); // Call the API client method
		return response.data;
	},
);

// Async thunk for updating a new order
export const deleteOrderComments = createAsyncThunk(
	'order/comments/delete',
	async (id) => {
		const response = await commentsApi.deleteOrderComments(id); // Call the API client method
		return response.data;
	},
);

// Define initial state
const initialState = {
	orderComments: [], // Array of order comments
	orderComment: ComentariosOrdenesMantenimientoModel({}), // Single order comment
	loading: false,
	error: null,
};

// Define the slice
export const orderCommentsSlice = createSlice({
	name: 'orderComments',
	initialState,
	reducers: {
		clearOrderCommentsState: (state) => {
			state.orderComments = [];
			state.orderComment = null;
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getOrderCommentsById.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(getOrderCommentsById.fulfilled, (state, action) => {
			state.loading = false;
			state.orderComments = action.payload;
		});
		builder.addCase(getOrderCommentsById.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(createNewOrderComments.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(createNewOrderComments.fulfilled, (state, action) => {
			state.loading = false;
			state.orderComment = action.payload;
		});
		builder.addCase(createNewOrderComments.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(searchOrderComments.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(searchOrderComments.fulfilled, (state, action) => {
			state.loading = false;
			state.orderComments = action.payload; // Update the orderComments array
		});
		builder.addCase(searchOrderComments.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

// Export actions and selectors
export const { clearOrderCommentsState } = orderCommentsSlice.actions;
export const selectOrderComments = (state) => state.orderComments.orderComments; // Select the orderComments array
export const selectOrderComment = (state) => state.orderComments.orderComment; // Select the single order comment
export const selectOrderCommentsLoading = (state) =>
	state.orderComments.loading;
export const selectOrderCommentsError = (state) => state.orderComments.error;

// Export the reducer
export default orderCommentsSlice.reducer;
