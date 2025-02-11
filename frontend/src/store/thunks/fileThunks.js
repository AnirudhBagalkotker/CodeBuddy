import { createAsyncThunk } from '@reduxjs/toolkit';
import { setFiles, setOpenFiles, setActiveFile, setCode, setLanguage, setProjectName } from '../slices/fileSlice';
import { findFirstFile } from '../../utils/fileHelpers';

export const initializeFiles = createAsyncThunk('files/initialize',
	async (_, { dispatch }) => {
		const storedFiles = JSON.parse(localStorage.getItem('codeFiles')) || {
			'root': { type: 'folder', children: { 'Welcome.txt': { type: 'file', content: 'Hi, This is a Sample file', language: 'plaintext' } }, isOpen: true }
		};
		localStorage.setItem('codeFiles', JSON.stringify(storedFiles));
		dispatch(setFiles(storedFiles));

		const projectName = localStorage.getItem('projectName') || 'Untitled Project';
		localStorage.setItem('projectName', projectName);
		dispatch(setProjectName(projectName));

		const { fullPath, key } = findFirstFile(storedFiles.root.children);

		if (fullPath && key) {
			dispatch(setOpenFiles([fullPath,]));
			dispatch(setActiveFile(fullPath));
			dispatch(setCode(storedFiles.root.children[key].content));
			dispatch(setLanguage(storedFiles.root.children[key].language));
		}
	}
);

export const saveFilesToStorage = createAsyncThunk('files/saveToStorage',
	async (newFiles, { dispatch }) => {
		localStorage.setItem('codeFiles', JSON.stringify(newFiles));
		dispatch(setFiles(newFiles));
	}
);

export const saveNewFiles = createAsyncThunk('files/saveNewFiles',
	async (_, { getState, dispatch }) => {
		const state = getState();
		localStorage.setItem('codeFiles', JSON.stringify(state.files.files));
		dispatch(setFiles(state.files.files));
	}
);

export const handleFileSelect = createAsyncThunk('files/selectFile',
	async ({ fullPath, file }, { dispatch, getState }) => {
		const state = getState();
		if (!state.files.openFiles.includes(fullPath)) {
			dispatch(setOpenFiles([...state.files.openFiles, fullPath]));
		}
		dispatch(setActiveFile(fullPath));
		dispatch(setCode(file.content));
		dispatch(setLanguage(file.language));
	}
);

export const handleProjectNameChange = createAsyncThunk('files/changeProjectName',
	async (name, { dispatch }) => {
		localStorage.setItem('projectName', name);
		dispatch(setProjectName(name));
	}
);
