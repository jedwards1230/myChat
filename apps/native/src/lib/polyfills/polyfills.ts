import { ReadableStream } from "web-streams-polyfill";
import { TextEncoder, TextDecoder } from "text-encoding";
import { setupURLPolyfill } from "react-native-url-polyfill";
// @ts-ignore
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";
// @ts-ignore
import { fetch, Headers, Request, Response } from "react-native-fetch-api";

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
