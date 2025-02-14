import { Files, Play, CodeXml, BugPlay, BrainCircuit, MessageSquareCode, } from 'lucide-react';
import PropTypes from 'prop-types';

const IconSidebar = ({ activeMenu, setActiveMenu }) => {
	return (
		<div className="bg-[#2d2d2d] flex flex-col items-center px-2 py-0">
			<SidebarButton
				icon={<Files size={30} className="text-[#eeeeee]" />}
				isActive={activeMenu === 'files'}
				onClick={() => setActiveMenu(activeMenu === 'files' ? null : 'files')}
				title='File Explorer'
			/>
			<SidebarButton
				icon={<Play size={30} className="text-[#eeeeee]" />}
				isActive={activeMenu === 'run'}
				onClick={() => setActiveMenu(activeMenu === 'run' ? null : 'run')}
				title='Run Code'
			/>
			<SidebarButton
				icon={<CodeXml size={30} className="text-[#eeeeee]" />}
				isActive={activeMenu === 'code'}
				onClick={() => setActiveMenu(activeMenu === 'code' ? null : 'code')}
				title='CodeGENE'
			/>
			<SidebarButton
				icon={<BugPlay size={30} className="text-[#eeeeee]" />}
				isActive={activeMenu === 'debug'}
				onClick={() => setActiveMenu(activeMenu === 'debug' ? null : 'debug')}
				title='DebugGENE'
			/>
			<SidebarButton
				icon={<BrainCircuit size={30} className="text-[#eeeeee]" />}
				isActive={activeMenu === 'explain'}
				onClick={() => setActiveMenu(activeMenu === 'explain' ? null : 'explain')}
				title='ExplainGENE'
			/>
			<SidebarButton
				icon={<MessageSquareCode size={30} className="text-[#eeeeee]" />}
				isActive={activeMenu === 'comments'}
				onClick={() => setActiveMenu(activeMenu === 'comments' ? null : 'comments')}
				title='CommentsGENE'
			/>
		</div>
	);
};

const SidebarButton = ({ icon, isActive, onClick, title }) => {
	return (
		<button
			className={`my-3 p-1 bg-[#2d2d2d] ${isActive ? 'opacity-100' : 'opacity-20 hover:opacity-60'}`}
			onClick={onClick}
			title={title}>
			{icon}
		</button>
	);
};

IconSidebar.propTypes = {
	activeMenu: PropTypes.string,
	setActiveMenu: PropTypes.func.isRequired,
}

SidebarButton.propTypes = {
	icon: PropTypes.element.isRequired,
	isActive: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
}

export default IconSidebar;