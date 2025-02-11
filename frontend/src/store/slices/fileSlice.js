import { createSlice } from '@reduxjs/toolkit';
import { getLanguage, findFirstFile } from '../../utils/fileHelpers';

const initialState = {
	projectName: 'Untitled Project',
	files: { 'root': { type: 'folder', children: { 'Welcome.txt': { type: 'file', content: 'Hi, This is a Sample file', language: 'plaintext' } }, isOpen: true } },
	openFiles: [],
	activeFile: null,
	code: '',
	language: 'plaintext'
};

const fileSlice = createSlice({
	name: 'files',
	initialState,
	reducers: {
		setFiles: (state, action) => {
			state.files = action.payload;
		},
		setOpenFiles: (state, action) => {
			state.openFiles = action.payload;
		},
		setActiveFile: (state, action) => {
			state.activeFile = action.payload;
		},
		setCode: (state, action) => {
			state.code = action.payload;
		},
		setLanguage: (state, action) => {
			state.language = action.payload;
		},
		setProjectName: (state, action) => {
			state.projectName = action.payload;
		},
		toggleFolderOpen: (state, action) => {
			const { path } = action.payload;
			const parts = path.split('/').slice(1);
			let current = state.files.root;

			for (const part of parts) {
				if (!current.children[part]) return;
				current = current.children[part];
			}

			if (current.type === 'folder') {
				current.isOpen = !current.isOpen;
			}
		},
		deleteFileOrFolder: (state, action) => {
			const { path } = action.payload;
			const parts = path.split('/');
			const name = parts.pop();

			const newFiles = JSON.parse(JSON.stringify(state.files));
			let current = newFiles.root;

			for (let i = 1; i < parts.length; i++) {
				if (!current.children[parts[i]]) return;
				current = current.children[parts[i]];
			}

			if (!current.children[name]) return;
			delete current.children[name];

			state.openFiles = state.openFiles.filter(file => !file.startsWith(path));
			state.files = newFiles;

			if (state.activeFile?.startsWith(path)) {
				const { fullPath, key } = findFirstFile(newFiles.root.children);

				if (fullPath && key) {
					state.activeFile = fullPath;
					state.code = newFiles.root.children[key].content;
					state.language = newFiles.root.children[key].language;
				}
			}
		},
		createFileOrFolder: (state, action) => {
			const { path, type } = action.payload;
			const parts = path.split('/').filter(p => p !== '');
			if (parts.length === 0) return;

			const lastPart = parts[parts.length - 1];

			const newFiles = JSON.parse(JSON.stringify(state.files));
			let current = newFiles.root;

			for (let i = 0; i < parts.length - 1; i++) {
				const part = parts[i];
				if (!current.children[part]) {
					current.children[part] = {
						type: 'folder',
						children: {},
						isOpen: true
					};
				}
				current = current.children[part];
			}

			if (current.children[lastPart]) return;

			if (type === 'file') {
				current.children[lastPart] = {
					type: 'file',
					content: '',
					language: getLanguage(lastPart)
				};

				const fullPath = `root/${parts.join('/')}`;
				if (!state.openFiles.includes(fullPath)) state.openFiles.push(fullPath);
				state.activeFile = fullPath;
				state.code = '';
				state.language = getLanguage(lastPart);
			} else {
				current.children[lastPart] = {
					type: 'folder',
					children: {},
					isOpen: false
				};
			}

			state.files = newFiles;
		},
		renameFileOrFolder: (state, action) => {
			const { oldPath, newName } = action.payload;
			const parts = oldPath.split('/');
			const name = parts.pop();

			let current = state.files.root;
			for (let i = 1; i < parts.length; i++) {
				if (!current.children[parts[i]]) return;
				current = current.children[parts[i]];
			}

			if (!current.children[name]) return;
			if (current.children[newName] && newName !== name) return;

			current.children = { ...current.children, [newName]: { ...current.children[name] }, };
			delete current.children[name];
		},
	}
});

export const {
	setFiles,
	setOpenFiles,
	setActiveFile,
	setCode,
	setLanguage,
	setProjectName,
	toggleFolderOpen,
	deleteFileOrFolder,
	createFileOrFolder,
	renameFileOrFolder
} = fileSlice.actions;

export default fileSlice.reducer;