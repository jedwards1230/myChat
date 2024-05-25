import { useEffect, useState } from "react";

import { type GPT4Tokenizer } from "@mychat/db/tokenizer";

let tokenizer: GPT4Tokenizer;

// Lazy load for TextEncoder polyfill
function getTokenizer() {
	if (!tokenizer) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		tokenizer = require("@mychat/db/tokenizer").default;
	}
	return tokenizer;
}

function getTokenCount(input: string) {
	const tokenizer = getTokenizer();
	return tokenizer.estimateTokenCount(input);
}

export function useTokenCount(input: string) {
	const [tokenCount, setTokenCount] = useState(0);

	useEffect(() => {
		try {
			const tokens = getTokenCount(input);
			setTokenCount(tokens);
		} catch (error) {
			console.error(error);
		}
	}, [input]);

	return tokenCount;
}
