import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	monacoOptions: {
		fontSize: 16,
		wordWrap: 'off',
		minimap: { enabled: false },
		fontFamily: 'JetBrains Mono, monospace',
		lineHeight: 21,
		automaticLayout: true,
		scrollBeyondLastLine: false,
		suggestions: { enabled: true },
		quickSuggestions: true,
		suggestOnTriggerCharacters: true,
		padding: { top: 16, bottom: 16 },
	}
};

const editorSlice = createSlice({
	name: 'editor',
	initialState,
	reducers: {
		updateEditorOptions: (state, action) => {
			state.monacoOptions = { ...state.monacoOptions, ...action.payload };
		}
	}
});

export const { updateEditorOptions } = editorSlice.actions;
export default editorSlice.reducer;