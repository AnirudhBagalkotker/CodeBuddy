import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { initializeFiles } from './store/thunks/fileThunks';
import IconSidebar from './components/Sidebar/IconSidebar';
import FileExplorer from './components/Sidebar/FileExplorer';
import MonacoEditor from './components/Editor/MonacoEditor';
import EditorTabs from './components/Editor/EditorTabs';
import RunPanel from './components/Panels/RunPanel';
import CommentsPanel from './components/Panels/CommentsPanel';

const App = () => {
	const [activeMenu, setActiveMenu] = useState('files');

	useEffect(() => { store.dispatch(initializeFiles()); }, []);

	return (
		<div className='min-h-screen w-screen bg-slate-100 dark:bg-slate-900'>
			<Provider store={store}>
				<div className="flex flex-col h-screen bg-[#1e1e1e]">
					{/* Header */}
					<div className="h-12 bg-[#1f1f1f] border-b border-[#2d2d2d] flex items-center px-4">
						<h1 className="text-[#eeeeee] text-xl font-bold">CodeBuddy.ai</h1>
					</div>
					<div className="flex flex-1 overflow-hidden">
						<IconSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

						{activeMenu && (
							<div className="w-64 min-w-[256px] bg-[#252526] border-r border-[#2d2d2d]">
								{activeMenu === 'files' && <FileExplorer />}
								{activeMenu === 'run' && <RunPanel />}
								{activeMenu === 'comments' && <CommentsPanel />}
							</div>
						)}

						<div className="flex flex-col flex-1">
							<EditorTabs />
							<MonacoEditor />
						</div>
					</div>
				</div>
			</Provider>
		</div>
	);
};

export default App;