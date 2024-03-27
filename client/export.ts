import { $ } from "bun";

const file_name = "output.txt";

try {
	console.log("Exporting web app...");
	await $`rm ${file_name}`.quiet();
	await $`touch ${file_name}`;

	// Start the export command without waiting for it to finish
	const exportPromise = $`bunx expo export -p web > ${file_name}`.quiet();

	// Start the loop to check the file contents
	const checkFilePromise = new Promise<void>(async (resolve, reject) => {
		let found = false;
		while (!found) {
			// 1. read all lines
			const res = await Bun.file(file_name).text();
			if (res) {
				// 2. check if the line `App exported to:` is in the file
				if (res.includes("App exported to:")) {
					found = true;
				}
			}

			// sleep 300 ms
			await new Promise((resolve) => setTimeout(resolve, 300));
		}
		resolve();
	});

	const timeoutPromise = new Promise((_, reject) => {
		setTimeout(() => {
			reject(new Error("Timeout after 5 minutes"));
		}, 5 * 60 * 1000); // 5 minutes
	});

	// Wait for either the export command or the file check to finish
	await Promise.race([exportPromise, checkFilePromise, timeoutPromise]);

	const res = await Bun.file(file_name).text();
	console.log(res);

	await $`rm ${file_name}`;

	process.exit(0);
} catch (error) {
	console.error(error);
	try {
		const res = await Bun.file(file_name).text();
		console.error(res);
	} catch (error) {
		console.error(error);
	}
	process.exit(1);
}
