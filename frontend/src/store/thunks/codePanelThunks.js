import { createAsyncThunk } from "@reduxjs/toolkit";
import { setIsLoading, setError } from "../slices/codePanelSlice";
import { setCode } from '../slices/fileSlice';

export const generateCode = createAsyncThunk(
	'codePanel/generate',
	async (_, { dispatch, getState }) => {
		const { code, language } = getState().files;

		dispatch(setIsLoading(true));
		dispatch(setError(''));

		try {
			const response = await fetch('http://localhost:8000/generate_code/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ language, code })
			});

			if (!response.ok) throw new Error('Failed to generate code');

			const data = await response.json();
			const processedCode = data.replace('```' + language + '\n', '').replace('```', '');
			dispatch(setCode(processedCode));
		}
		catch (err) {
			dispatch(setError(err.message));
		}
		finally {
			dispatch(setIsLoading(false));
		}
	}
);