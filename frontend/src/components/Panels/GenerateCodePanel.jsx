import { useDispatch, useSelector } from 'react-redux';
import { generateCode } from '../../store/thunks/codePanelThunks';

const GenerateCodePanel = () => {
	const dispatch = useDispatch();
	const { isLoading, error } = useSelector(state => state.runPanel);

	return (
		<div className="p-4">
			<h3 className="text-[#eeeeee] font-medium mb-4">CodeGENE</h3>

			<button
				onClick={() => dispatch(generateCode())}
				disabled={isLoading}
				className="w-full px-4 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? 'Generating...' : 'Generate Code'}
			</button>

			{error && (
				<div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded">
					<p className="text-red-500 text-sm">{error}</p>
				</div>
			)}

			<p className="text-[#eeeeee] text-xs mt-4">
				Generate and complete your code for your project using <b>CodeGENE</b>.
			</p>

			<div className="mt-4 p-2 bg-blue-500/10 border border-blue-500/20 rounded">
				<p className="text-blue-500 text-xs">CodeBuddy&apos;s CodeGENE is powered by Llama-3 & Together.ai</p>
			</div>
		</div>
	);
};

export default GenerateCodePanel;