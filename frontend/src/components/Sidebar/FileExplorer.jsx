import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronRight, FolderOpen, Folder, File, X, FilePlus, FolderPlus, Download } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';
import { toggleFolderOpen, deleteFileOrFolder, createFileOrFolder, } from '../../store/slices/fileSlice';
import { handleFileSelect, saveNewFiles } from '../../store/thunks/fileThunks';

const FolderItem = ({ name, item, indent, onToggle, onDelete, renderChildren }) => (
	<div>
		<div
			onClick={onToggle}
			className="flex items-center px-2 py-1 rounded-sm cursor-pointer hover:bg-[#2a2d2e] group"
			style={{ paddingLeft: `${indent}px` }}
		>
			{item.isOpen ? (<ChevronDown size={16} className="text-[#eeeeee] mr-1" />)
				: (<ChevronRight size={16} className="text-[#eeeeee] mr-1" />)}
			{item.isOpen ? (<FolderOpen size={16} className="text-[#eeeeee] mr-2" />)
				: (<Folder size={16} className="text-[#eeeeee] mr-2" />)}
			<span className="text-[#eeeeee] text-sm flex-1 select-none">{name}</span>
			<X
				size={16}
				className="text-[#eeeeee] opacity-0 group-hover:opacity-100 hover:text-white"
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
			/>
		</div>
		{item.isOpen && renderChildren()}
	</div>
);

const FileItem = ({ name, indent, isActive, onSelect, onDelete }) => (
	<div
		onClick={onSelect}
		className={`flex items-center px-2 py-1 rounded-sm cursor-pointer group ${isActive ? 'bg-[#37373d]' : 'hover:bg-[#2a2d2e]'}`}
		style={{ paddingLeft: `${indent + 20}px` }}
	>
		<File size={16} className="text-[#eeeeee] mr-2" />
		<span className="text-[#eeeeee] text-sm flex-1 select-none">{name}</span>
		<X
			size={16}
			className="text-[#eeeeee] opacity-0 group-hover:opacity-100 hover:text-white"
			onClick={(e) => {
				e.stopPropagation();
				onDelete();
			}}
		/>
	</div>
);

const FileExplorer = () => {
	const dispatch = useDispatch();
	const { files, activeFile } = useSelector((state) => state.files);

	const handleCreateFile = () => {
		const path = prompt('Enter File path (e.g., folder/subfolder/name)');
		if (path) {
			dispatch(createFileOrFolder({ path, type: 'file' }));
			dispatch(saveNewFiles());
		}
	};

	const handleCreateFolder = () => {
		const path = prompt('Enter Folder path (e.g., folder/subfolder/name)');
		if (path) {
			dispatch(createFileOrFolder({ path, type: 'folder' }));
			dispatch(saveNewFiles());
		}
	}

	const handleDownloadProject = () => {
		const zip = new JSZip();

		const addFilesToZip = (folder, zipFolder) => {
			for (let name in folder.children) {
				console.log(name);
				const child = folder.children[name];
				if (child.type === 'folder') {
					const newFolder = zipFolder.folder(name);
					addFilesToZip(child, newFolder);
				} else if (child.type === 'file') zipFolder.file(name, child.content);
			}
		};

		const rootFolder = files.root;
		addFilesToZip(rootFolder, zip);

		zip.generateAsync({ type: 'blob' }).then((content) => {
			saveAs(content, 'project.zip');
		});
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
						onToggle={() => dispatch(toggleFolderOpen({ path: fullPath }))}
						onDelete={() => {
							dispatch(deleteFileOrFolder({ path: fullPath }))
							dispatch(saveNewFiles());
						}}
						renderChildren={() => renderFileTree(item, fullPath, level + 1)}
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
					onDelete={() => {
						dispatch(deleteFileOrFolder({ path: fullPath }))
						dispatch(saveNewFiles());
					}}
				/>
			);
		});
	};

	return (
		<div className="flex flex-col h-full">
			<div className="p-4 text-[#eeeeee] font-medium flex items-center justify-between">
				<span className='select-none'>FILE EXPLORER</span>
				<div className='flex items-center justify-center space-x-1'>
					<div
						onClick={handleCreateFile}
						className="bg-[##252526] hover:bg-[#37373d] p-1 rounded"
						title='Create File'
					>
						<FilePlus size={18} />
					</div>
					<div
						onClick={handleCreateFolder}
						className="bg-[##252526] hover:bg-[#37373d] p-1 rounded"
						title='Create Folder'
					>
						<FolderPlus size={18} />
					</div>
					<div
						onClick={handleDownloadProject}
						className="bg-[##252526] hover:bg-[#37373d] p-1 rounded"
						title='Download Project'
					>
						<Download size={18} />
					</div>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto px-2">
				{renderFileTree(files.root)}
			</div>
		</div>
	);
};

FolderItem.propTypes = {
	name: PropTypes.string.isRequired,
	item: PropTypes.object.isRequired,
	indent: PropTypes.number.isRequired,
	onToggle: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	renderChildren: PropTypes.func.isRequired,
};

FileItem.propTypes = {
	name: PropTypes.string.isRequired,
	indent: PropTypes.number.isRequired,
	isActive: PropTypes.bool.isRequired,
	onSelect: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default FileExplorer;