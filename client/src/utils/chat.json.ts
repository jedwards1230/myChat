import { ChatCompletionMessage } from "openai/resources";

type ChatResponseCallbackJSON = (data: ChatCompletionMessage) => void;

export async function handleChatResponseJSON(
	response: Response,
	cb: ChatResponseCallbackJSON
) {
	const data = await response.json();
	if (data.choices[0].message) {
		cb(data.choices[0].message);
	} else {
		console.error(data);
	}
}
