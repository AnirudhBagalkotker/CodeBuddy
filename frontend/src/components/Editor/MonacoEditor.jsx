import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor, { useMonaco } from '@monaco-editor/react';
import { setCode } from '../../store/slices/fileSlice';
import { saveFilesToStorage } from '../../store/thunks/fileThunks';

const MonacoEditor = () => {
	const dispatch = useDispatch();
	const editorRef = useRef(null);
	const monaco = useMonaco();
	const { code, language, activeFile, files } = useSelector(state => state.files);
	const { monacoOptions } = useSelector(state => state.editor);

	const handleEditorDidMount = (editor) => {
		editorRef.current = editor;
	};

	const handleCodeChange = (value) => {
		dispatch(setCode(value));

		if (activeFile) {
			const parts = activeFile.split('/');
			const newFiles = JSON.parse(JSON.stringify(files));
			let current = newFiles.root;

			for (let i = 1; i < parts.length - 1; i++) {
				current = current.children[parts[i]];
			}

			const fileName = parts[parts.length - 1];
			current.children[fileName] = {
				...current.children[fileName],
				content: value
			};

			console.log(newFiles);
			dispatch(saveFilesToStorage(newFiles));
		}
	};

	useEffect(() => {
		if (monaco && editorRef.current) {
			editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
				console.log("Ctrl + S pressed");
				dispatch(saveFilesToStorage(files));
			});
		}
	}, [monaco, dispatch, files]);

	return (
		<div className="flex-1 h-full">
			<Editor
				height="100%"
				theme="vs-dark"
				language={language}
				value={code}
				onChange={handleCodeChange}
				onMount={handleEditorDidMount}
				options={monacoOptions}
				loading={<EditorLoadingPlaceholder />}
			/>
		</div>
	);
};

const EditorLoadingPlaceholder = () => (
	<div className="h-full w-full flex items-center justify-center bg-[#1e1e1e]">
		<div className="text-[#eeeeee] text-lg">Loading CodeBuddy Editor...</div>
	</div>
);

export default MonacoEditor;