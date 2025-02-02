import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import { setActiveFile, setOpenFiles, setCode, setLanguage } from '../../store/slices/fileSlice';
import { getFileIcon } from '../../utils/fileHelpers.js';

const EditorTabs = () => {
	const dispatch = useDispatch();
	const { openFiles, activeFile, files } = useSelector(state => state.files);

	const handleTabClick = (filePath) => {
		if (filePath === activeFile) return;

		const parts = filePath.split('/');
		let current = files.root;
		for (let i = 1; i < parts.length - 1; i++) current = current.children[parts[i]];
		const file = current.children[parts[parts.length - 1]];

		dispatch(setActiveFile(filePath));
		dispatch(setCode(file.content));
		dispatch(setLanguage(file.language));
	};

	const closeTab = (filePath, e) => {
		e.stopPropagation();
		const newOpenFiles = openFiles.filter(file => file !== filePath);
		dispatch(setOpenFiles(newOpenFiles));

		if (activeFile === filePath) {
			if (newOpenFiles.length > 0) handleTabClick(newOpenFiles[0]);
			else {
				dispatch(setActiveFile(null));
				dispatch(setCode(''));
				dispatch(setLanguage('plaintext'));
			}
		}
	};

	return (
		<div className="bg-[#2d2d2d] flex items-center h-9 overflow-x-auto">
			{openFiles.map((filePath) => (
				<Tab
					key={filePath}
					filePath={filePath}
					isActive={filePath === activeFile}
					onClick={() => handleTabClick(filePath)}
					onClose={(e) => closeTab(filePath, e)}
					icon={getFileIcon(filePath)}
				/>
			))}
		</div>
	);
};

// Tab component
const Tab = ({ filePath, isActive, onClick, onClose, icon }) => {
	const fileName = filePath.split('/').pop();

	return (
		<div
			onClick={onClick}
			className={`flex items-center h-full px-3 min-w-[100px] max-w-[200px] cursor-pointer select-none group
				${isActive
					? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#0e639c]'
					: 'text-[#969696] border-t-2 border-t-[#2d2d2d] hover:bg-[#292c2c] hover:border-t-[#292c2c] '
				}`}
			title={filePath.split('root/').pop()}
		>
			<span className="mr-2">{icon}</span>
			<span className="truncate flex-1 text-sm">{fileName}</span>
			<button
				onClick={onClose}
				className={`ml-2 p-1 rounded-md opacity-0
					${isActive ? 'bg-[#1e1e1e] text-white opacity-100' : 'text-[#969696] group-hover:opacity-100 bg-[#292c2c] hover:bg-[#232525]'}`
				}
				title="Close Tab"
			>
				<X size={14} />
			</button>
		</div >
	);
};

Tab.propTypes = {
	filePath: PropTypes.string.isRequired,
	isActive: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	icon: PropTypes.node.isRequired,
};

export default EditorTabs;