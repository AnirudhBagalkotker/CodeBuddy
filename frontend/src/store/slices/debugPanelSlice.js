import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isLoading: false,
	error: ''
};

const debugPanelSlice = createSlice({
	name: 'debugPanel',
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

export const { setIsLoading, setError } = debugPanelSlice.actions;
export default debugPanelSlice.reducer;