import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isLoading: false,
	error: ''
};

const explainPanelSlice = createSlice({
	name: 'explainPanel',
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

export const { setIsLoading, setError } = explainPanelSlice.actions;
export default explainPanelSlice.reducer;