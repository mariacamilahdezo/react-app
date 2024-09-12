import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Import the API client instance
import { ordersApi } from 'app/store/apiInstances';
import { calculateDateInterval } from 'src/utils/dateTime';
import { OrdenMantenimientoModel } from '../../initialStates';

// Async thunks
export const getOrderById = createAsyncThunk('orders/fetchById', async (id) => {
	const response = await ordersApi.getMaintenanceOrder(id);
	return response.data;
});

export const createNewOrder = createAsyncThunk(
	'orders/create',
	async (orderData) => {
		const response = await ordersApi.createMaintenanceOrder(orderData); // Call the API client method
		return response.data;
	},
);

export const searchOrders = createAsyncThunk('orders/search', async () => {
	const limit = 5000;
	const twoMonthsAgo = calculateDateInterval(2);
	const filters = [
		{
			conjunction: 'or',
			filters: [
				{
					operator: 'not_in',
					values: ['CANCELADA', 'CERRADA'],
					name: 'status',
				},
				{
					conjunction: 'and',
					filters: [
						{
							operator: 'in',
							values: ['CANCELADA', 'CERRADA'],
							name: 'status',
						},
						{
							operator: 'gt',
							values: twoMonthsAgo,
							name: 'modified_time',
						},
					],
				},
			],
		},
	];
	const sorts = [
		{
			name: 'created_time',
			order: 'desc',
		},
	];
	const body = {
		filters,
		sorts,
	};

	const response = await ordersApi.getMaintenanceOrders(limit, body); // Replace with your actual API method
	return response.data;
});

export const updateOrder = createAsyncThunk(
	'orders/updateOrder',
	async ({ id, data }, thunkAPI) => {
		try {
			const response = await ordersApi.updateMaintenanceOrder(id, data);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue({ error: error.message });
		}
	},
);

// Initial state
const initialState = {
	orders: [],
	order: OrdenMantenimientoModel({}),
	loading: false,
	error: null,
};

// Slice
export const ordersSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {
		clearOrdersState: (state) => {
			state.orders = [];
			state.order = null;
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getOrderById.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(getOrderById.fulfilled, (state, action) => {
			state.loading = false;
			state.order = action.payload;
		});
		builder.addCase(getOrderById.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(createNewOrder.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(createNewOrder.fulfilled, (state, action) => {
			state.loading = false;
			state.order = action.payload;
		});
		builder.addCase(createNewOrder.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(updateOrder.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(updateOrder.fulfilled, (state, action) => {
			state.loading = false;
			state.order = action.payload;
		});
		builder.addCase(updateOrder.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(searchOrders.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(searchOrders.fulfilled, (state, action) => {
			state.loading = false;
			state.orders = action.payload;
		});
		builder.addCase(searchOrders.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

// Export actions and selectors
export const { clearOrdersState } = ordersSlice.actions;
export const selectOrders = (state) => state.orders.orders;
export const selectOrder = (state) => state.orders.order;
export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderError = (state) => state.orders.error;

// Export the reducer
export default ordersSlice.reducer;
