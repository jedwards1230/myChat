import GPT4Tokenizer from "gpt4-tokenizer";
import { useEffect, useState } from "react";

const tokenizer = new GPT4Tokenizer({ type: "gpt3" });

export function useTokenCount(input: string) {
	const [tokenCount, setTokenCount] = useState(0);

	useEffect(() => {
		const count = tokenizer.estimateTokenCount(input);
		setTokenCount(count);
	}, [input]);

	return tokenCount;
}
