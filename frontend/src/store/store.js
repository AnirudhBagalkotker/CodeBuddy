import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './slices/fileSlice';
import runPanelReducer from './slices/runPanelSlice';
import commentsPanelReducer from './slices/commentsPanelSlice';
import codePanelReducer from './slices/codePanelSlice';
import editorReducer from './slices/editorSlice';

export const store = configureStore({
	reducer: {
		files: fileReducer,
		runPanel: runPanelReducer,
		commentsPanel: commentsPanelReducer,
		codePanel: codePanelReducer,
		editor: editorReducer,
	}
});