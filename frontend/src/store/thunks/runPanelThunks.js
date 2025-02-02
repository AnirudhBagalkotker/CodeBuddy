import { createAsyncThunk } from '@reduxjs/toolkit';
import { setIsLoading, setError, setOutput } from '../slices/runPanelSlice';

export const runCode = createAsyncThunk(
	'runPanel/runCode',
	async (_, { dispatch, getState }) => {
		const { code, activeFile } = getState().files;
		const { inputs } = getState().runPanel;

		dispatch(setIsLoading(true));
		dispatch(setError(''));

		const language = activeFile.split('.').pop();
		try {
			if (!code) throw new Error("Code is empty");
			const input = (JSON.stringify(inputs) === "['']") ? '' : inputs.join('\n');
			const response = await fetch('http://localhost:8000/run_code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					code,
					language,
					inputs: input
				})
			});

			if (!response.ok) throw new Error("Failed to Run Code. " + response.status + " Error");

			const data = await response.json();
			dispatch(setOutput(data.output));
		} catch (err) {
			console.error(err);
			dispatch(setError(err.message));
		} finally {
			dispatch(setIsLoading(false));
		}
	}
);