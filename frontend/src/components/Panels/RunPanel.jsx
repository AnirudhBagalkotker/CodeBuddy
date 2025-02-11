import { useDispatch, useSelector } from 'react-redux';
import { setInputs } from '../../store/slices/runPanelSlice';
import { runCode } from '../../store/thunks/runPanelThunks';
import { getRunStatus } from '../../utils/fileHelpers';

const RunPanel = () => {
	const dispatch = useDispatch();
	const { inputs, isLoading, error, output } = useSelector(state => state.runPanel);
	const { activeFile } = useSelector(state => state.files);

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

	const isAcceptable = getRunStatus(activeFile.split('.').pop());
	const isNotAllowed = !(isAcceptable && !isLoading);

	return (
		<div className="p-4">
			<h3 className="text-[#eeeeee] font-medium mb-4 select-none">RUN CODE</h3>

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
								disabled={isNotAllowed}
								className="text-red-500 px-4 py-2 rounded-sm text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							> Remove </button>
						)}
					</div>
				))}
				<button
					onClick={addInputField}
					disabled={isNotAllowed}
					className="w-full px-4 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-sm text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
				> + Add more Inputs </button>
			</div>

			<button
				onClick={() => dispatch(runCode())}
				disabled={isNotAllowed}
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

			{!isAcceptable && (
				<div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
					<p className="text-yellow-500 text-xs">This file type is not supported</p>
				</div>
			)}

			<p className="text-[#eeeeee] text-xs mt-4">
				Run or compile your code using CodeX-API Compilers/Interpreters.
			</p>
		</div>
	);
};

export default RunPanel;