import { useDispatch, useSelector } from 'react-redux';
import { setInputs } from '../../store/slices/runPanelSlice';
import { runCode } from '../../store/thunks/runPanelThunks';

const RunPanel = () => {
	const dispatch = useDispatch();
	const { inputs, isLoading, error, output } = useSelector(state => state.runPanel);

	const handleInputChange = (index, value) => {
		const updatedInputs = [...inputs];
		updatedInputs[index] = value;
		dispatch(setInputs(updatedInputs));
	};

	const addInputField = () => {
		dispatch(setInputs([...inputs, '']));
	};

	const removeInputField = (index) => {
		if (inputs.length === 1) return;
		const updatedInputs = inputs.filter((_, i) => i !== index);
		dispatch(setInputs(updatedInputs));
	};

	return (
		<div className="p-4">
			<h3 className="text-[#eeeeee] font-medium mb-4">RUN CODE</h3>

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
						{inputs.length > 1 && (
							<button
								onClick={() => removeInputField(index)}
								className="text-red-500 px-4 py-2 rounded-sm text-sm flex items-center justify-center gap-2"
							>
								Remove
							</button>
						)}
					</div>
				))}
				<button
					onClick={addInputField}
					className="w-full px-4 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-sm text-sm flex items-center justify-center gap-2 mt-2"
				>
					+ Add more Inputs
				</button>
			</div>

			<button
				onClick={() => dispatch(runCode())}
				disabled={isLoading}
				className="w-full px-4 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? 'Compiling...' : 'Run/Compile Code'}
			</button>

			{error && (
				<div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded">
					<p className="text-red-500 text-sm">{error}</p>
				</div>
			)}

			{output && (
				<div className="mt-4 p-2 bg-[#1e1e1e] border border-[#2d2d2d] rounded">
					<pre className="text-[#eeeeee] text-sm whitespace-pre-wrap">{output}</pre>
				</div>
			)}

			<p className="text-[#eeeeee] text-xs mt-4">
				Run or compile your code using CodeX-API Compilers/Interpreters.
			</p>
		</div>
	);
};

export default RunPanel;