import type { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction";

import logger from "@/lib/logs/logger";
import type { ChatCompletionNamedToolChoice } from "openai/resources/index.mjs";

async function saveTitle({ title }: { title: string }) {
	// toto: this step is probably not necessary. just handle response and title update directly.
	return title;
}

export const runnableSaveTitle: RunnableToolFunctionWithParse<{ title: string }> &
	ChatCompletionNamedToolChoice = {
	type: "function",
	function: {
		name: "saveTitle",
		description: "save a title for a thread of messages.",
		parameters: {
			type: "object",
			properties: {
				title: { type: "string" },
			},
		},
		function: saveTitle,
		parse: JSON.parse,
	},
};
