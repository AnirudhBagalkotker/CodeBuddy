import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isLoading: false,
	error: ''
};

const commentsPanelSlice = createSlice({
	name: 'commentsPanel',
	initialState,
	reducers: {
		setIsLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		}
	}
});

export const { setIsLoading, setError } = commentsPanelSlice.actions;
export default commentsPanelSlice.reducer;