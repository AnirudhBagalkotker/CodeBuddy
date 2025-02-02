/* eslint-disable react/prop-types */
import { Files, MessageSquare, Play } from 'lucide-react';

const IconSidebar = ({ activeMenu, setActiveMenu }) => {
	return (
		<div className="bg-[#2d2d2d] flex flex-col items-center p-2">
			<SidebarButton
				icon={<Files size={24} className="text-[#eeeeee]" />}
				isActive={activeMenu === 'files'}
				onClick={() => setActiveMenu(activeMenu === 'files' ? null : 'files')}
			/>
			<SidebarButton
				icon={<Play size={24} className="text-[#eeeeee]" />}
				isActive={activeMenu === 'run'}
				onClick={() => setActiveMenu(activeMenu === 'run' ? null : 'run')}
			/>
			<SidebarButton
				icon={<MessageSquare size={24} className="text-[#eeeeee]" />}
				isActive={activeMenu === 'comments'}
				onClick={() => setActiveMenu(activeMenu === 'comments' ? null : 'comments')}
			/>
		</div>
	);
};

const SidebarButton = ({ icon, isActive, onClick }) => {
	return (
		<button
			className={`p-2 mb-2 hover:bg-[#37373d] ${isActive ? 'bg-[#37373d] opacity-100' : 'opacity-40'}`}
			onClick={onClick}
		>
			{icon}
		</button>
	);
};

export default IconSidebar;