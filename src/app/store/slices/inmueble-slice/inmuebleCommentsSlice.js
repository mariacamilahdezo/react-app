import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// Import the API client instance
import { commentsApi } from 'app/store/apiInstances';
import { ComentariosInmueblesModel } from '../../initialStates';

// Inmuebles Comments:
// Async thunk for fetching a specific inmueble by ID
export const getInmuebleCommentsById = createAsyncThunk(
	'comments/inmueble/fetchById',
	async (id) => {
		const response = await commentsApi.getInmuebleComments(id); // Call the API client method
		return response.data;
	},
);

// Async thunk for creating a new inmueble comment
export const createNewInmuebleComments = createAsyncThunk(
	'comments/inmueble/create',
	async (InmuebleCommentsData) => {
		const response =
			await commentsApi.createInmuebleComments(InmuebleCommentsData); // Call the API client method
		return response.data;
	},
);

// Async thunk for searching inmueble comments
export const searchInmuebleComments = createAsyncThunk(
	'comments/inmuebles/search',
	async () => {
		const response = await commentsApi.searchInmuebleComments(); // Call the API client method
		return response.data;
	},
);

// Async thunk for updating an inmueble comment
export const updateInmuebleComments = createAsyncThunk(
	'comments/inmueble/update',
	async (InmuebleCommentsData) => {
		const response =
			await commentsApi.updateInmuebleComments(InmuebleCommentsData); // Call the API client method
		return response.data;
	},
);

// Async thunk for deleting an inmueble comment
export const deleteInmuebleComments = createAsyncThunk(
	'comments/inmueble/delete',
	async (id) => {
		const response = await commentsApi.deleteInmuebleComments(id); // Call the API client method
		return response.data;
	},
);

// Define initial state
const initialState = {
	inmuebleComments: [], // Array of inmueble comments
	inmuebleComment: ComentariosInmueblesModel({}), // Single inmueble comment
	loading: false,
	error: null,
};

// Define the slice
export const inmuebleCommentsSlice = createSlice({
	name: 'inmuebleComments',
	initialState,
	reducers: {
		clearInmuebleCommentsState: (state) => {
			state.inmuebleComments = [];
			state.inmuebleComment = null;
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getInmuebleCommentsById.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(getInmuebleCommentsById.fulfilled, (state, action) => {
			state.loading = false;
			state.inmuebleComments = action.payload;
		});
		builder.addCase(getInmuebleCommentsById.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(createNewInmuebleComments.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(
			createNewInmuebleComments.fulfilled,
			(state, action) => {
				state.loading = false;
				state.inmuebleComment = action.payload;
			},
		);
		builder.addCase(createNewInmuebleComments.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(searchInmuebleComments.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(searchInmuebleComments.fulfilled, (state, action) => {
			state.loading = false;
			state.inmuebleComments = action.payload; // Update the inmuebleComments array
		});
		builder.addCase(searchInmuebleComments.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

// Export actions and selectors
export const { clearInmuebleCommentsState } = inmuebleCommentsSlice.actions;
export const selectInmuebleComments = (state) =>
	state.inmuebleComments.inmuebleComments; // Select the inmuebleComments array
export const selectInmuebleComment = (state) =>
	state.inmuebleComments.inmuebleComment; // Select the single inmueble comment
export const selectInmuebleCommentsLoading = (state) =>
	state.inmuebleComments.loading;
export const selectInmuebleCommentsError = (state) =>
	state.inmuebleComments.error;

// Export the reducer
export default inmuebleCommentsSlice.reducer;
