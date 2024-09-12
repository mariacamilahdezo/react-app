import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// Import the API client instance
import { inmueblesApi } from 'app/store/apiInstances';
import { InmuebleModel } from '../../initialStates';

// Async thunk for fetching a specific inmueble by ID
export const getInmuebleById = createAsyncThunk(
	'inmuebles/fetchById',
	async (id) => {
		const response = await inmueblesApi.getInmueble(id); // Call the API client method
		return response.data;
	},
);

// Async thunk for creating a new inmueble
export const createNewInmueble = createAsyncThunk(
	'inmuebles/create',
	async (inmuebleData) => {
		const response = await inmueblesApi.createInmueble(inmuebleData); // Call the API client method
		return response.data;
	},
);

// Async thunk for searching inmuebles
export const searchInmuebles = createAsyncThunk(
	'inmuebles/search',
	async () => {
		const limit = 5000;
		const response = await inmueblesApi.searchInmueble(limit); // Call the API client methods
		return response.data;
	},
);

// Async thunk for updating a new inmueble
export const updateInmueble = createAsyncThunk(
	'inmuebles/updateInmueble',
	async ({ id, data }, thunkAPI) => {
		try {
			const response = await inmueblesApi.updateInmueble(id, data);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue({ error: error.message });
		}
	},
);

// Async thunk for updating a new inmueble
export const deleteInmueble = createAsyncThunk(
	'inmuebles/delete',
	async (id) => {
		const response = await inmueblesApi.deleteInmueble(id); // Call the API client method
		return response.data;
	},
);

// Define initial state
const initialState = {
	inmuebles: [], // Array of inmuebles
	inmueble: InmuebleModel({}), // Single inmueble
	loading: false,
	error: null,
};
// Define the slice
export const inmueblesSlice = createSlice({
	name: 'inmuebles',
	initialState,
	reducers: {
		clearInmueblesState: (state) => {
			state.inmuebles = [];
			state.inmueble = null;
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getInmuebleById.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(getInmuebleById.fulfilled, (state, action) => {
			state.loading = false;
			state.inmueble = action.payload;
		});
		builder.addCase(getInmuebleById.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(createNewInmueble.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(createNewInmueble.fulfilled, (state, action) => {
			state.loading = false;
			state.inmueble = action.payload;
		});
		builder.addCase(createNewInmueble.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(searchInmuebles.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(searchInmuebles.fulfilled, (state, action) => {
			state.loading = false;
			state.inmuebles = action.payload; // Update the inmuebles array
		});
		builder.addCase(searchInmuebles.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

// Export actions and selectors
export const { clearInmueblesState } = inmueblesSlice.actions;
export const selectInmuebles = (state) => state.inmuebles.inmuebles; // Select the inmuebles array
export const selectInmueble = (state) => state.inmuebles.inmueble; // Select the single inmueble
export const selectInmuebleLoading = (state) => state.inmuebles.loading;
export const selectInmuebleError = (state) => state.inmuebles.error;

// Export the reducer
export default inmueblesSlice.reducer;
