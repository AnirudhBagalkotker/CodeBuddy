import { useDispatch, useSelector } from 'react-redux';
import { generateComments } from '../../store/thunks/commentsPanelThunks';

const CommentsPanel = () => {
	const dispatch = useDispatch();
	const { isLoading, error } = useSelector(state => state.commentsPanel);

	return (
		<div className="p-4">
			<h3 className="text-[#eeeeee] font-medium mb-4">COMMENT GENERATOR</h3>

			<button
				onClick={() => dispatch(generateComments())}
				disabled={isLoading}
				className="w-full px-4 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? 'Generating...' : 'Generate Comments'}
			</button>

			{error && (
				<div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded">
					<p className="text-red-500 text-sm">{error}</p>
				</div>
			)}

			<p className="text-[#eeeeee] text-xs mt-4">
				Generate meaningful comments for your code using CodeBuddy&apos;s Code Comments Generation AI.
			</p>
		</div>
	);
};

export default CommentsPanel;