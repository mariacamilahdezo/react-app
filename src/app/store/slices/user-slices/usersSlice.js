/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// Import the API client instance
import { userApi } from 'app/store/apiInstances';

export const searchUsers = createAsyncThunk(
	'users/searchUsers',
	async ({ limit, slim, body }) => {
		const response = await userApi.searchUsers(limit, slim, body); // Call the API client method
		return response.data;
	},
);

export const searchUserTypes = createAsyncThunk(
	'users/searchTypes',
	async () => {
		const response = await userApi.searchUserTypes();
		return response.data;
	},
);

/**
 * The initial state of the user slice.
 */
const initialState = {
	users: [], // Array of users
	types: [],
	loading: false,
	error: null,
};
/**
 * The User slice
 */
export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		clearUsersState: (state) => {
			state.users = [];
			state.types = [];
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(searchUsers.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(searchUsers.fulfilled, (state, action) => {
			state.loading = false;
			state.users = action.payload;
		});
		builder.addCase(searchUsers.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
		builder.addCase(searchUserTypes.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(searchUserTypes.fulfilled, (state, action) => {
			state.loading = false;
			state.types = action.payload;
		});
		builder.addCase(searchUserTypes.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});
export const { clearUsersState } = usersSlice.actions;
export const selectUsers = (state) => state.users?.users;
export const selectUsersLoading = (state) => state.users?.loading;
export const selectUsersError = (state) => state.users?.error;
export const selectUserTypes = (state) => state.users?.types;
export default usersSlice.reducer;
