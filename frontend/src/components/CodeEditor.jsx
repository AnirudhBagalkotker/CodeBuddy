import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
	Files,
	MessageSquare,
	File,
	Folder,
	FolderOpen,
	ChevronRight,
	ChevronDown,
	X,
	Plus,
	Play
} from 'lucide-react';

const CodeEditor = () => {
	const [files, setFiles] = useState({
		'root': {
			type: 'folder',
			children: {},
			isOpen: true
		}
	});
	const [openFiles, setOpenFiles] = useState([]);
	const [activeFile, setActiveFile] = useState(null);
	const [code, setCode] = useState('');
	const [language, setLanguage] = useState('plaintext');
	const [inputs, setInputs] = useState(['']); // Start with one empty input field
	const [isLoading, setIsLoading] = useState(false);
	const [activeMenu, setActiveMenu] = useState('files');
	const [, setError] = useState('');

	useEffect(() => {
		const storedFiles = JSON.parse(localStorage.getItem('codeFiles')) || {
			'root': { type: 'folder', children: {}, isOpen: true }
		};
		setFiles(storedFiles);

		// Find first file to open
		const findFirstFile = (obj) => {
			for (const [key, value] of Object.entries(obj)) {
				if (value.type === 'file') return key;
				if (value.type === 'folder') {
					const found = findFirstFile(value.children);
					if (found) return found;
				}
			}
			return null;
		};

		const firstFile = findFirstFile(storedFiles.root.children);
		if (firstFile) {
			setOpenFiles([firstFile]);
			setActiveFile(firstFile);
			setCode(storedFiles.root.children[firstFile].content);
			setLanguage(storedFiles.root.children[firstFile].language);
		}
	}, []);

	const saveFilesToStorage = (updatedFiles) => {
		localStorage.setItem('codeFiles', JSON.stringify(updatedFiles));
		setFiles(updatedFiles);
	};

	const createFileOrFolder = () => {
		const path = prompt(`Enter path (e.g., folder/subfolder/name)`);
		const isValidPath = path.split('/').every((part) => part !== '' && part !== '.' && part !== '..');
		if (!isValidPath) return;

		const type = path.split('.').pop() == null ? 'folder' : 'file';

		const parts = path.split('/');
		let current = files.root;
		let currentPath = 'root';

		// Create or traverse folders
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
			currentPath = `${currentPath}/${part}`;
		}

		const name = parts[parts.length - 1];
		if (type.toLowerCase() === 'file') {
			current.children[name] = {
				type: 'file',
				content: '',
				language: getLanguage(name)
			};
			const fullPath = `${currentPath}/${name}`;
			setOpenFiles([...openFiles, fullPath]);
			setActiveFile(fullPath);
			setCode('');
			setLanguage(getLanguage(name));
		} else {
			current.children[name] = {
				type: 'folder',
				children: {},
				isOpen: true
			};
		}

		saveFilesToStorage({ ...files });
	};

	const toggleFolder = (path) => {
		const parts = path.split('/').slice(1);
		let current = files.root;

		for (const part of parts) {
			if (!current.children[part]) return;
			current = current.children[part];
		}

		if (current.type === 'folder') {
			current.isOpen = !current.isOpen;
			saveFilesToStorage({ ...files });
			setFiles({ ...files });
		}
	};


	const getLanguage = (fileName) => {
		const fileExtension = fileName.split('.').pop();
		const languageMap = {
			js: 'javascript',
			py: 'python',
			java: 'java',
			c: 'c',
			cpp: 'cpp',
			ts: 'typescript',
			html: 'html',
			css: 'css',
		};
		return languageMap[fileExtension] || 'plaintext';
	};

	const deleteFileOrFolder = (path, e) => {
		e.stopPropagation();
		if (!window.confirm(`Delete ${path}?`)) return;

		const parts = path.split('/');
		const name = parts.pop();
		let current = files;
		for (const part of parts) {
			current = current[part].children;
		}

		const newFiles = { ...files };
		let target = newFiles;
		for (const part of parts) {
			target = target[part].children;
		}
		delete target[name];

		// If deleting a folder, close all files within
		if (current[name].type === 'folder') {
			const closeFilesInFolder = (folder, basePath) => {
				Object.entries(folder.children).forEach(([childName, child]) => {
					const childPath = `${basePath}/${childName}`;
					if (child.type === 'folder') {
						closeFilesInFolder(child, childPath);
					} else {
						setOpenFiles(prev => prev.filter(file => !file.startsWith(childPath)));
						if (activeFile?.startsWith(childPath)) {
							setActiveFile(null);
							setCode('');
						}
					}
				});
			};
			closeFilesInFolder(current[name], path);
		} else {
			// If deleting a file
			setOpenFiles(prev => prev.filter(file => file !== path));
			if (activeFile === path) {
				setActiveFile(null);
				setCode('');
			}
		}

		saveFilesToStorage(newFiles);
	};

	const renderFileTree = (structure, path = 'root', level = 0) => {
		return Object.entries(structure.children).map(([name, item]) => {
			const fullPath = `${path}/${name}`;
			const indent = level * 12;

			if (item.type === 'folder') {
				return (
					<div key={fullPath}>
						<div
							onClick={() => {
								console.log("clicked");
								toggleFolder(fullPath);
							}}
							className="flex items-center px-2 py-1 rounded-sm cursor-pointer hover:bg-[#2a2d2e] group"
							style={{ paddingLeft: `${indent}px` }}
						>
							{item.isOpen ? (
								<ChevronDown size={16} className="text-[#eeeeee] mr-1" />
							) : (
								<ChevronRight size={16} className="text-[#eeeeee] mr-1" />
							)}
							{item.isOpen ? (
								<FolderOpen size={16} className="text-[#eeeeee] mr-2" />
							) : (
								<Folder size={16} className="text-[#eeeeee] mr-2" />
							)}
							<span className="text-[#eeeeee] text-sm flex-1">{name}</span>
							<X
								size={16}
								className="text-[#eeeeee] opacity-0 group-hover:opacity-100 hover:text-white"
								onClick={(e) => deleteFileOrFolder(fullPath, e)}
							/>
						</div>
						{item.isOpen && renderFileTree(item, fullPath, level + 1)}
					</div>
				);
			}

			return (
				<div
					key={fullPath}
					onClick={() => handleFileSelect(fullPath, item)}
					className={`flex items-center px-2 py-1 rounded-sm cursor-pointer group ${fullPath === activeFile ? 'bg-[#37373d]' : 'hover:bg-[#2a2d2e]'
						}`}
					style={{ paddingLeft: `${indent + 20}px` }}
				>
					<File size={16} className="text-[#eeeeee] mr-2" />
					<span className="text-[#eeeeee] text-sm flex-1">{name}</span>
					<X
						size={16}
						className="text-[#eeeeee] opacity-0 group-hover:opacity-100 hover:text-white"
						onClick={(e) => deleteFileOrFolder(fullPath, e)}
					/>
				</div>
			);
		});
	};

	const handleFileSelect = (fullPath, file) => {
		if (!openFiles.includes(fullPath)) {
			setOpenFiles([...openFiles, fullPath]);
		}
		setActiveFile(fullPath);
		setCode(file.content);
		setLanguage(file.language);
	};

	const closeFileTab = (fileName, e) => {
		e.stopPropagation();
		const newOpenFiles = openFiles.filter((file) => file !== fileName);
		setOpenFiles(newOpenFiles);

		if (activeFile === fileName) {
			setActiveFile(newOpenFiles[0] || null);
			if (newOpenFiles[0]) {
				const parts = newOpenFiles[0].split('/');
				let current = files.root;
				for (let i = 1; i < parts.length - 1; i++) {
					current = current.children[parts[i]];
				}
				const file = current.children[parts[parts.length - 1]];
				setCode(file.content);
				setLanguage(file.language);
			} else {
				setCode('');
				setLanguage('plaintext');
			}
		}
	};

	const handleCodeChange = (value) => {
		setCode(value);
		if (activeFile) {
			const parts = activeFile.split('/');
			const newFiles = { ...files };
			let current = newFiles.root;
			for (let i = 1; i < parts.length - 1; i++) {
				current = current.children[parts[i]];
			}
			current.children[parts[parts.length - 1]].content = value;
			saveFilesToStorage(newFiles);
		}
	};

	const handleInputChange = (index, value) => {
		const updatedInputs = [...inputs];
		updatedInputs[index] = value;
		setInputs(updatedInputs);
	};

	const addInputField = () => {
		setInputs([...inputs, '']);
	};

	const removeInputField = (index) => {
		if (inputs.length === 1) return; // Ensure at least one input field exists
		const updatedInputs = inputs.filter((_, i) => i !== index);
		setInputs(updatedInputs);
	};

	const handleRunCode = async () => {
		setIsLoading(true);
		setError('');

		try {
			const response = await fetch('https://api.codex.jaagrav.in', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					code,
					language,
					input: inputs.join('\n'),
				}),
			});

			if (!response.ok) throw new Error('Failed to run code');

			const data = await response.json();
			console.log('Output:', data.output);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGenerateComments = async () => {
		setIsLoading(true);
		setError('');
		try {
			const response = await fetch('http://localhost:8000/generate_comments/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ language, code }),
			});
			if (!response.ok) throw new Error('Failed to generate comments');
			const data = await response.json();
			setCode(data.replace('```' + language + '\n', '').replace('```', ''));
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col h-screen bg-[#1e1e1e]">
			{/* Header */}
			<div className="h-12 bg-[#1f1f1f] border-b border-[#2d2d2d] flex items-center px-4">
				<h1 className="text-[#eeeeee] text-xl font-bold">CodeBuddy.ai</h1>
			</div>

			<div className="flex flex-1 overflow-hidden">
				{/* Icon Sidebar */}
				<div className="bg-[#2d2d2d] flex flex-col items-center p-2">
					<button
						onClick={() => setActiveMenu(activeMenu === 'files' ? null : 'files')}
						className={`p-2 mb-2 rounded hover:bg-[#37373d] ${activeMenu === 'files' ? 'bg-[#37373d] opacity-100' : 'opacity-40'
							}`}
					>
						<Files size={24} className="text-[#eeeeee]" />
					</button>
					<button
						onClick={() => setActiveMenu(activeMenu === 'run' ? null : 'run')}
						className={`p-2 mb-2 rounded hover:bg-[#37373d] ${activeMenu === 'run' ? 'bg-[#37373d] opacity-100' : 'opacity-40'
							}`}
					>
						<Play size={24} className="text-[#eeeeee]" />
					</button>
					<button
						onClick={() => setActiveMenu(activeMenu === 'comments' ? null : 'comments')}
						className={`p-2 rounded hover:bg-[#37373d] ${activeMenu === 'comments' ? 'bg-[#37373d] opacity-100' : 'opacity-40'
							}`}
					>
						<MessageSquare size={24} className="text-[#eeeeee]" />
					</button>
				</div>

				{/* Active Menu Panel */}
				{activeMenu && (
					<div className="w-64 min-w-[256px] bg-[#252526] border-r border-[#2d2d2d]">
						{activeMenu === 'files' && (
							<div className="flex flex-col h-full">
								<div className="p-4 text-[#eeeeee] font-medium flex items-center justify-between">
									<span>EXPLORER</span>
									<button
										onClick={createFileOrFolder}
										className="hover:bg-[#37373d] p-1 rounded"
									>
										<Plus size={18} />
									</button>
								</div>
								<div className="flex-1 overflow-y-auto px-2">
									{renderFileTree(files.root)}
								</div>
							</div>
						)}

						{activeMenu === 'run' && (
							<div className="p-4">
								<h3 className="text-[#eeeeee] font-medium mb-4">RUN CODE</h3>

								{/* Input Fields */}
								<div className="mb-8">
									{inputs.map((input, index) => (
										<div key={index} className="flex items-center gap-2 mb-2">
											<input
												type="text"
												value={input}
												onChange={(e) => handleInputChange(index, e.target.value)}
												className="w-full bg-[#333] text-white p-2 rounded text-sm border border-[#444]"
												placeholder={`Input ${index + 1}`}
											/>
											{inputs.length > 0 && (
												<button
													onClick={() => removeInputField(index)}
													className="text-red-500 px-4 py-2 rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													Remove
												</button>
											)}
										</div>
									))}
									<button
										onClick={addInputField}
										className="w-full px-4 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										+ Add more Inputs
									</button>

									<p className="text-[#eeeeee] text-xs mt-4">
										Provide inputs for your code to run. Add multiple inputs by if required. Leave it empty if there are no inputs.
									</p>
								</div>

								{/* Run Button */}
								<button
									onClick={handleRunCode}
									disabled={isLoading}
									className="w-full px-4 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? 'Compiling...' : 'Run/Compile Code'}
								</button>

								<p className="text-[#eeeeee] text-xs mt-4">
									Run or compile your code using CodeX-API Compilers/Interpreters.
								</p>
							</div>
						)}


						{activeMenu === 'comments' && (
							<div className="p-4">
								<h3 className="text-[#eeeeee] font-medium mb-4">COMMENT GENERATOR</h3>
								<button
									onClick={handleGenerateComments}
									disabled={isLoading}
									className="w-full px-4 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? 'Generating...' : 'Generate Comments'}
								</button>
								<p className="text-[#eeeeee] text-xs mt-4">
									Generate meaningful comments for your code using CodeBuddy&#39;s Code Comments Generation AI.
								</p>
							</div>
						)}
					</div>
				)}

				{/* Editor */}
				<div className="flex flex-col flex-1">
					{/* Tabs Bar */}
					<div className="bg-[#2d2d2d] flex items-center space-x-2">
						{openFiles.map((filePath) => (
							<div
								key={filePath}
								onClick={() => {
									const parts = filePath.split('/');
									let current = files.root;
									for (let i = 1; i < parts.length - 1; i++) {
										current = current.children[parts[i]];
									}
									handleFileSelect(filePath, current.children[parts[parts.length - 1]]);
								}}
								className={`flex items-center px-3 py-2 rounded-sm cursor-pointer text-[#eeeeee] text-sm ${filePath === activeFile ? 'bg-[#37373d] opacity-100' : 'hover:bg-[#2a2d2e] opacity-50'}`}
							>
								<span>{filePath.split('/').pop()}</span>
								<X
									size={16}
									className="ml-3 opacity-50 hover:opacity-100 cursor-pointer"
									onClick={(e) => closeFileTab(filePath, e)}
								/>
							</div>
						))}
					</div>
					<Editor
						height="100%"
						theme="vs-dark"
						language={language}
						value={code}
						onChange={handleCodeChange}
						options={{
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
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default CodeEditor;