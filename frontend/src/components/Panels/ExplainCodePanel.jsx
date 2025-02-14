import { useDispatch, useSelector } from 'react-redux';
import { explainCode } from '../../store/thunks/explainPanelThunks';
import { getAIStatus } from '../../utils/fileHelpers';

const ExplainCodePanel = () => {
	const dispatch = useDispatch();
	const { isLoading, error } = useSelector(state => state.runPanel);
	const { activeFile } = useSelector(state => state.files);

	const isAcceptable = getAIStatus(activeFile.split('.').pop());
	const isDisabled = !(isAcceptable && !isLoading);

	return (
		<div className="p-4">
			<h3 className="text-[#eeeeee] font-medium mb-4">ExplainGENE</h3>

			<button
				onClick={() => dispatch(explainCode())}
				disabled={isDisabled}
				className="w-full px-4 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? 'Generating...' : 'Explain Code'}
			</button>

			{error && (
				<div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded">
					<p className="text-red-500 text-sm">{error}</p>
				</div>
			)}

			{!isAcceptable && (
				<div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
					<p className="text-yellow-500 text-xs">This file type is not supported</p>
				</div>
			)}

			<p className="text-[#eeeeee] text-xs mt-4">
				Understand your code for your project using <b>ExplainGENE</b>.
			</p>

			<div className="mt-4 p-2 bg-blue-500/10 border border-blue-500/20 rounded">
				<p className="text-blue-500 text-xs">CodeBuddy&apos;s ExplainGENE is powered by Llama-3 & Together.ai</p>
			</div>
		</div>
	);
};

export default ExplainCodePanel;