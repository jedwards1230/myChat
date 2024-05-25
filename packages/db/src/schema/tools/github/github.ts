import type { RunnableToolFunction } from "openai/lib/RunnableFunction.mjs";
import { OpenAIEmbeddings } from "@langchain/openai";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

async function processRepository({ repoUrl }: { repoUrl: string }) {
	// Initialize GitHub document loader with specific repo information
	const loader = new GithubRepoLoader(repoUrl, {
		branch: "main",
		recursive: false,
		unknown: "warn",
		processSubmodules: false,
		maxConcurrency: 5,
	});

	const documents = await loader.load();

	const vectorStore = await MemoryVectorStore.fromDocuments(
		documents,
		new OpenAIEmbeddings(),
	);
	const resultOne = await vectorStore.similaritySearch("hello world", 1);
	console.log(resultOne);

	return true;
}

export const runnableProcessRepository: RunnableToolFunction<{ repoUrl: string }> = {
	type: "function",
	function: {
		name: "processRepository",
		description:
			"Clones a GitHub repo, creates a vector store for the documents, and returns true",
		parameters: {
			type: "object",
			properties: {
				repoUrl: {
					type: "string",
					format: "uri",
					pattern: "^https?://github\\.com/.+/.+$",
				},
			},
		},
		function: processRepository,
		parse: JSON.parse,
	},
};
