const Clipboard = {
	getStringAsync: navigator.clipboard.readText,
	setStringAsync: navigator.clipboard.writeText,
};

export default Clipboard;
