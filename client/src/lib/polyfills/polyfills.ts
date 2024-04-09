import { ReadableStream } from "web-streams-polyfill";
import { TextEncoder, TextDecoder } from "text-encoding";
import { setupURLPolyfill } from "react-native-url-polyfill";

if (typeof Symbol === undefined || !Symbol.asyncIterator) {
	Object.defineProperty(Symbol, "asyncIterator", {
		value: Symbol("Symbol.asyncIterator"),
		configurable: true,
		enumerable: false,
		writable: true,
	});
}

const { polyfillGlobal } = require("react-native/Libraries/Utilities/PolyfillFunctions");
const { fetch, Headers, Request, Response } = require("react-native-fetch-api");

setupURLPolyfill();
polyfillGlobal("fetch", () => fetch);
polyfillGlobal("Headers", () => Headers);
polyfillGlobal("Request", () => Request);
polyfillGlobal("Response", () => Response);
polyfillGlobal("TextEncoder", () => TextEncoder);
polyfillGlobal("TextDecoder", () => TextDecoder);
polyfillGlobal("ReadableStream", () => ReadableStream);
