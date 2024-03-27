import type GPT4Tokenizer from "gpt4-tokenizer";
import { useEffect, useState } from "react";

let tokenizer: GPT4Tokenizer;

async function getTokenizer() {
	if (!tokenizer) {
		const GPT4Tokenizer = (await import("gpt4-tokenizer")).default;
		tokenizer = new GPT4Tokenizer({ type: "gpt3" });
	}
	return tokenizer;
}

export async function getTokenCount(input: string) {
	const tokenizer = await getTokenizer();
	return tokenizer.estimateTokenCount(input);
}

export function useTokenCount(input: string) {
	const [tokenCount, setTokenCount] = useState(0);

	useEffect(() => {
		getTokenCount(input).then(setTokenCount);
	}, [input]);

	return tokenCount;
}
