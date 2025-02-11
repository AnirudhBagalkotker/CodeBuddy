import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronRight, FolderOpen, Folder, File, FilePlus, FolderPlus, Download, EllipsisVertical, Trash } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';
import { toggleFolderOpen, deleteFileOrFolder, createFileOrFolder, renameFileOrFolder, setActiveFile, setOpenFiles } from '../../store/slices/fileSlice';
import { handleFileSelect, saveNewFiles, handleProjectNameChange } from '../../store/thunks/fileThunks';

const EditableLabel = ({ value, isEditing, onEdit, onSubmit, className }) => {
	const inputRef = useRef(null);
	const initialValue = useRef(value);

	useEffect(() => {
		if (isEditing) {
			const handleClickOutside = (e) => { if (inputRef.current && !inputRef.current.contains(e.target)) onSubmit(true) };
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [isEditing, onSubmit]);

	if (!isEditing) return <span className={className}>{value}</span>;

	return (
		<input
			ref={inputRef}
			type="text"
			value={value}
			onChange={(e) => onEdit(e.target.value)}
			onKeyDown={(e) => {
				if (e.key === 'Enter') onSubmit(false);
				else if (e.key === 'Escape') {
					onEdit(initialValue.current);
					onSubmit(true);
				}
			}}
			className={`editable-label bg-[#3c3c3c] text-[#eeeeee] text-sm px-1 rounded outline-none border border-[#0e639c] w-full ${className}`}
			autoFocus
		/>
	);
};

const FolderItem = ({ name, item, indent, renderChildren, onContextMenu, onToggle, onRename, isEditing }) => {
	const [editedName, setEditedName] = useState(name);

	const handleSubmit = (cancel) => {
		if (!cancel && editedName.trim()) onRename(editedName.trim());
		else {
			setEditedName(name);
			onRename(name);
		}
	};

	return (
		<div>
			<div
				onClick={onToggle}
				onContextMenu={onContextMenu}
				className="flex items-center px-2 py-1 rounded-sm cursor-pointer hover:bg-[#2a2d2e] group"
				style={{ paddingLeft: `${indent}px` }}
			>
				{item.isOpen ? (<ChevronDown size={16} className="text-[#eeeeee] mr-1" />)
					: (<ChevronRight size={14} className="text-[#eeeeee] mr-1.5" />)}
				{item.isOpen ? (<FolderOpen size={16} className="text-[#eeeeee] mr-1.5" />)
					: (<Folder size={14} className="text-[#eeeeee] mr-1.5" />)}
				<EditableLabel
					value={editedName}
					isEditing={isEditing}
					onEdit={setEditedName}
					onSubmit={handleSubmit}
					className="text-[#eeeeee] text-sm flex-1 select-none"
				/>
				<EllipsisVertical
					size={14}
					className="text-[#eeeeee] z-40 opacity-0 group-hover:opacity-100 hover:text-white"
					onClick={(e) => {
						e.stopPropagation();
						onContextMenu(e);
					}}
				/>
			</div>
			{item.isOpen && renderChildren()}
		</div>
	);
};

const FileItem = ({ name, indent, isActive, onSelect, onContextMenu, onRename, isEditing }) => {
	const [editedName, setEditedName] = useState(name);

	const handleSubmit = (cancel) => {
		if (!cancel && editedName.trim()) onRename(editedName.trim());
		else {
			setEditedName(name);
			onRename(name);
		}
	};

	return (
		<div
			onClick={onSelect}
			onContextMenu={onContextMenu}
			className={`flex items-center px-2 py-1 rounded-sm cursor-pointer group ${isActive ? 'bg-[#37373d]' : 'hover:bg-[#2d2d2d]'}`}
			style={{ paddingLeft: `${indent + 20}px` }}
		>
			<File size={14} className="text-[#eeeeee] mr-1.5" />
			<EditableLabel
				value={editedName}
				isEditing={isEditing}
				onEdit={setEditedName}
				onSubmit={handleSubmit}
				className="text-[#eeeeee] text-sm flex-1 select-none"
			/>
			<EllipsisVertical
				size={14}
				className="text-[#eeeeee] z-40 opacity-0 group-hover:opacity-100 hover:text-white"
				onClick={(e) => {
					e.stopPropagation();
					onContextMenu(e);
				}}
			/>
		</div>
	);
};

const ContextMenu = ({ x, y, options, onClose, onStartRename }) => (
	<div
		style={{ left: x, top: y }}
		className="absolute bg-[#3c3c3c] border border-[#2d2d2d] rounded-md shadow-md z-50"
	>
		{options.map((option, index) => (
			<div
				key={index}
				className="flex items-stretch justify-start min-w-60 m-1 px-4 py-1 rounded cursor-pointer hover:bg-[#0e639c]"
				onClick={(e) => {
					e.stopPropagation();
					if (option.label === 'Rename') onStartRename();
					else option.action();
					onClose();
				}}
			>
				<span className="text-[#eeeeee] text-sm ml-2">{option.label}</span>
			</div>
		))}
	</div>
);

const FileExplorer = () => {
	const dispatch = useDispatch();
	const { files, activeFile, openFiles, projectName } = useSelector((state) => state.files);
	const [editingPath, setEditingPath] = useState(null);
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, options: [], });

	const closeContextMenu = () => {
		setContextMenu((prev) => ({ ...prev, visible: false }));
	};

	React.useEffect(() => {
		const handleClick = () => { if (contextMenu.visible) closeContextMenu(); };

		window.addEventListener('click', handleClick);
		return () => window.removeEventListener('click', handleClick);
	}, [contextMenu.visible]);

	const handleCreateFile = (directory = '') => {
		directory = directory.replace('root/', '');
		if (directory && !directory.endsWith('/')) directory += '/';
		const name = prompt('Enter File path (e.g., folder/subfolder/name)');
		if (name && name.includes('.')) {
			const path = directory + name;
			dispatch(createFileOrFolder({ path, type: 'file' }));
			dispatch(saveNewFiles());
		}
	};

	const handleCreateFolder = (directory = '') => {
		directory = directory.replace('root/', '');
		if (directory && !directory.endsWith('/')) directory += '/';
		const name = prompt('Enter Folder path (e.g., folder/subfolder/name)')
		if (name && !name.includes('.')) {
			const path = directory + name;
			dispatch(createFileOrFolder({ path, type: 'folder' }));
			dispatch(saveNewFiles());
		}
	};

	const handleDownloadProject = (folder = files.root, fileName = 'Project') => {
		if (folder.type !== 'folder') {
			const blob = new Blob([folder.content], { type: 'text/plain' });
			saveAs(blob, fileName);
			return;
		}

		const zip = new JSZip();
		const zipFolder = zip.folder(fileName);

		const addFilesToZip = (folder, zipFolder) => {
			for (let name in folder.children) {
				const child = folder.children[name];
				if (child.type === 'folder') {
					const newFolder = zipFolder.folder(name);
					addFilesToZip(child, newFolder);
				} else if (child.type === 'file') zipFolder.file(name, child.content);
			}
		};

		addFilesToZip(folder, zipFolder);
		zip.generateAsync({ type: 'blob' }).then((content) => { saveAs(content, `${fileName}.zip`); });
	};

	const copyPath = (path) => {
		path = path.replace('root', projectName);
		navigator.clipboard.writeText(path);
		alert('Path copied to clipboard');
	};

	const handleDelete = (path) => {
		dispatch(deleteFileOrFolder({ path }));
		dispatch(saveNewFiles());
	};

	const clearProject = () => {
		localStorage.removeItem('codeFiles');
		localStorage.removeItem('projectName');
		window.location.reload();
	};

	const handleRename = (path, newName) => {
		if (newName === path.split('/').pop()) setEditingPath(null);
		else {
			dispatch(renameFileOrFolder({ oldPath: path, newName }));
			dispatch(saveNewFiles());
			setEditingPath(null);

			const newPath = path.replace(path.split('/').pop(), newName);
			const newOpenFiles = openFiles.map((file) => file === path ? newPath : file);
			dispatch(setOpenFiles(newOpenFiles));
			if (activeFile === path) dispatch(setActiveFile(newPath));
		}
	};

	const startRename = (path) => {
		setEditingPath(path);
	};

	const showContextMenu = (e, item, path) => {
		e.preventDefault();

		let options = [];
		if (item.type === 'folder') {
			options = [
				{ label: 'Create File', action: () => handleCreateFile(path) },
				{ label: 'Create Folder', action: () => handleCreateFolder(path) },
				{ label: 'Copy Path', action: () => copyPath(path) },
				{ label: 'Download', action: () => handleDownloadProject(item, path.split('/').pop()) },
				{ label: 'Rename', action: () => startRename(path) },
				{ label: 'Delete', action: () => handleDelete(path) },
			];
		} else {
			options = [
				{ label: 'Copy Path', action: () => copyPath(path) },
				{ label: 'Download', action: () => handleDownloadProject(item, path.split('/').pop()) },
				{ label: 'Rename', action: () => startRename(path) },
				{ label: 'Delete', action: () => handleDelete(path) },
			];
		}

		setContextMenu({ visible: true, x: e.clientX, y: e.clientY, options, path });
		e.stopPropagation();
	};

	const renderFileTree = (structure, path = 'root', level = 0) => {
		return Object.entries(structure.children).map(([name, item]) => {
			const fullPath = `${path}/${name}`;
			const indent = level * 12;

			if (item.type === 'folder') {
				return (
					<FolderItem
						key={fullPath}
						name={name}
						item={item}
						indent={indent}
						renderChildren={() => renderFileTree(item, fullPath, level + 1)}
						onContextMenu={(e) => showContextMenu(e, item, fullPath)}
						onToggle={() => dispatch(toggleFolderOpen({ path: fullPath }))}
						onRename={(newName) => handleRename(fullPath, newName)}
						isEditing={editingPath === fullPath}
					/>
				);
			}

			return (
				<FileItem
					key={fullPath}
					name={name}
					indent={indent}
					isActive={fullPath === activeFile}
					onSelect={() => dispatch(handleFileSelect({ fullPath, file: item }))}
					onContextMenu={(e) => showContextMenu(e, item, fullPath)}
					onRename={(newName) => handleRename(fullPath, newName)}
					isEditing={editingPath === fullPath}
				/>
			);
		});
	};

	return (
		<div className="flex flex-col h-full">
			<div className="p-4 text-[#eeeeee] font-medium flex items-center justify-between">
				<span className="select-none text-md">EXPLORER</span>
				<div className="flex items-center justify-center space-x-1">
					<div
						onClick={() => handleCreateFile('root/')}
						className="bg-[#252526] hover:bg-[#37373d] p-1 rounded"
						title="Create File">
						<FilePlus size={16} />
					</div>
					<div
						onClick={() => handleCreateFolder('root/')}
						className="bg-[#252526] hover:bg-[#37373d] p-1 rounded"
						title="Create Folder">
						<FolderPlus size={16} />
					</div>
					<div
						onClick={() => handleDownloadProject(files.root, 'Project')}
						className="bg-[#252526] hover:bg-[#37373d] p-1 rounded"
						title="Download Project">
						<Download size={16} />
					</div>
					<div
						onClick={() => clearProject()}
						className="bg-[#252526] hover:bg-[#37373d] p-1 rounded"
						title="Collaborate">
						<Trash size={16} />
					</div>
				</div>
			</div>
			<div className="px-2 pb-1 text-[#eeeeee] font-medium flex justify-between items-stretch">
				<input
					type="text"
					value={projectName}
					onChange={(e) => dispatch(handleProjectNameChange(e.target.value))}
					className="bg-[#252526] select-none text-sm text-[#eeeeee] border-2 border-[#252526] px-2 py-1 rounded self-stretch w-full hover:border-[#37373d] focus:border-[#0e639c] focus:outline-none focus:bg-[#3c3c3c]"
				/>
			</div>
			<div className="flex-1 overflow-y-auto px-2">{renderFileTree(files.root)}</div>
			{contextMenu.visible && (
				<ContextMenu
					x={contextMenu.x}
					y={contextMenu.y}
					options={contextMenu.options}
					onClose={closeContextMenu}
					onStartRename={() => setEditingPath(contextMenu.path)}
				/>
			)}
		</div>
	);
};

EditableLabel.propTypes = {
	value: PropTypes.string.isRequired,
	isEditing: PropTypes.bool.isRequired,
	onEdit: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	className: PropTypes.string,
};

FolderItem.propTypes = {
	name: PropTypes.string.isRequired,
	item: PropTypes.object.isRequired,
	indent: PropTypes.number.isRequired,
	renderChildren: PropTypes.func.isRequired,
	onContextMenu: PropTypes.func.isRequired,
	onToggle: PropTypes.func.isRequired,
	onRename: PropTypes.func.isRequired,
	isEditing: PropTypes.bool,
};

FileItem.propTypes = {
	name: PropTypes.string.isRequired,
	indent: PropTypes.number.isRequired,
	isActive: PropTypes.bool.isRequired,
	onSelect: PropTypes.func.isRequired,
	onContextMenu: PropTypes.func.isRequired,
	onRename: PropTypes.func.isRequired,
	isEditing: PropTypes.bool,
};

ContextMenu.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	options: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired,
	onStartRename: PropTypes.func.isRequired,
};

export default FileExplorer;