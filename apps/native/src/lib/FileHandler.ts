export default class FileHandler {
	static MAX_FILE_SIZE = 5000000; // 5MB

	static handleFileList(fileList: FileList, cb: (content: string) => void) {
		Array.from(fileList).forEach((file) => {
			if (!this.validateFileSize(file)) {
				console.error(`File ${file.name} is too large.`);
				return;
			}

			const normalizedType = this.normalizeFileType(file.type);
			if (normalizedType.startsWith("text/")) {
				this.handleTextFile(file, cb);
			} else {
				switch (normalizedType) {
					case "image/jpeg":
					case "image/png":
						this.handleImageFile(file);
						break;
					case "application/pdf":
						this.handlePdfFile(file);
						break;
					default:
						console.log(`Unhandled file type: ${normalizedType}`);
				}
			}
		});
	}

	static validateFileSize(file: File): boolean {
		return file.size <= this.MAX_FILE_SIZE;
	}

	static normalizeFileType(fileType: string): string {
		// Add normalization logic here
		return fileType;
	}

	static handleTextFile(file: File, cb: (content: string) => void) {
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result;
			cb(text as string);
		};
		reader.readAsText(file);
	}

	static handleImageFile(file: File) {
		const reader = new FileReader();
		reader.onload = (e) => {
			const image = e.target?.result;
			console.log(image);
		};
		reader.readAsDataURL(file);
	}

	static handlePdfFile(file: File) {
		const reader = new FileReader();
		reader.onload = (e) => {
			const pdf = e.target?.result;
			console.log(pdf);
		};
		reader.readAsArrayBuffer(file);
	}

	static base64ToText(base64: string): string {
		return atob(base64.split(",")[1] ?? "");
	}

	static base64ToBlob(base64: string): Blob {
		const byteCharacters = atob(base64.split(",")[1] ?? "");
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		return new Blob([byteArray]);
	}
}
