import type GPT4Tokenizer from "gpt4-tokenizer";
import { useEffect, useState } from "react";

let tokenizer: GPT4Tokenizer;

// Lazy load for TextEncoder polyfill
function getTokenizer() {
    if (!tokenizer) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const GPT4Tokenizer = require("gpt4-tokenizer").default;
        tokenizer = new GPT4Tokenizer({ type: "gpt3" });
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
