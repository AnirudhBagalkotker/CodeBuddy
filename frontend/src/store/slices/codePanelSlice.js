import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isLoading: false,
	error: ''
};

const codePanelSlice = createSlice({
	name: 'codePanel',
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

export const { setIsLoading, setError } = codePanelSlice.actions;
export default codePanelSlice.reducer;