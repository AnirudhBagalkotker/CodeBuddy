import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	inputs: [''],
	isLoading: false,
	error: '',
	output: ''
};

const runPanelSlice = createSlice({
	name: 'runPanel',
	initialState,
	reducers: {
		setInputs: (state, action) => {
			state.inputs = action.payload;
		},
		setIsLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
		setOutput: (state, action) => {
			state.output = action.payload;
		}
	}
});

export const { setInputs, setIsLoading, setError, setOutput } = runPanelSlice.actions;
export default runPanelSlice.reducer;