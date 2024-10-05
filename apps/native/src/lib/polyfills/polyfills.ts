// @ts-ignore
import { fetch, Headers, Request, Response } from "react-native-fetch-api";
import { setupURLPolyfill } from "react-native-url-polyfill";
// @ts-ignore
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";
import { TextDecoder, TextEncoder } from "text-encoding";
import { ReadableStream } from "web-streams-polyfill";

if (typeof Symbol === "undefined" || !Symbol.asyncIterator) {
	Object.defineProperty(Symbol, "asyncIterator", {
		value: Symbol("Symbol.asyncIterator"),
		configurable: true,
		enumerable: false,
		writable: true,
	});
}

setupURLPolyfill();
polyfillGlobal("fetch", () => fetch);
polyfillGlobal("Headers", () => Headers);
polyfillGlobal("Request", () => Request);
polyfillGlobal("Response", () => Response);
polyfillGlobal("TextEncoder", () => TextEncoder);
polyfillGlobal("TextDecoder", () => TextDecoder);
polyfillGlobal("ReadableStream", () => ReadableStream);
