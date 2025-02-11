const langMap = {
	js: { name: 'javascript', icon: '📜', run: 1 },
	jsx: { name: 'javascript', icon: '⚛️', run: 0 },
	ts: { name: 'typescript', icon: '📘', run: 0 },
	tsx: { name: 'typescript', icon: '⚛️', run: 0 },
	css: { name: 'css', icon: '🎨', run: 0 },
	html: { name: 'html', icon: '🌐', run: 0 },
	json: { name: 'json', icon: '📋', run: 0 },
	md: { name: 'markdown', icon: '📝', run: 0 },
	py: { name: 'python', icon: '🐍', run: 1 },
	java: { name: 'java', icon: '☕', run: 1 },
	cpp: { name: 'c++', icon: '⚙️', run: 1 },
	c: { name: 'c', icon: '⚙️', run: 1 },
	default: { name: 'plaintext', icon: '📄', run: 0 },
};

export const getLanguage = (fileName) => {
	const fileExtension = fileName.split('.').pop();
	return langMap[fileExtension]?.name || 'plaintext';
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
	return (langMap[extension]?.icon) || langMap.default.icon;
};

export const getRunStatus = (fileExtension) => {
	return (langMap[fileExtension]?.run) || langMap.default.run;
};