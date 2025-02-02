export const getLanguage = (fileName) => {
	const fileExtension = fileName.split('.').pop();
	const languageMap = {
		js: 'javascript',
		jsx: 'javascript',
		py: 'python',
		java: 'java',
		c: 'c',
		cpp: 'cpp',
		ts: 'typescript',
		tsx: 'typescript',
		html: 'html',
		css: 'css',
	};
	return languageMap[fileExtension] || 'plaintext';
};

export const findFirstFile = (obj, currentPath = 'root') => {
	for (const [key, value] of Object.entries(obj)) {
		const fullPath = `${currentPath}/${key}`;

		if (value.type === 'file') return { fullPath, key };
		if (value.type === 'folder') {
			const found = findFirstFile(value.children, fullPath);
			if (found) return found;
		}
	}
	return null;
};

export const getFileIcon = (filePath) => {
	const extension = filePath.split('.').pop().toLowerCase();
	const iconMap = {
		js: '📜',
		jsx: '⚛️',
		ts: '📘',
		tsx: '⚛️',
		css: '🎨',
		html: '🌐',
		json: '📋',
		md: '📝',
		py: '🐍',
		java: '☕',
		cpp: '⚙️',
		c: '⚙️',
		default: '📄'
	};
	return iconMap[extension] || iconMap.default;
};