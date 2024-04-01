import "@azure/core-asynciterator-polyfill";
import { ReadableStream } from "web-streams-polyfill";
const { polyfillGlobal } = require("react-native/Libraries/Utilities/PolyfillFunctions");
const { fetch, Headers, Request, Response } = require("react-native-fetch-api");
const { TextEncoder, TextDecoder } = require("text-encoding");

polyfillGlobal("fetch", () => fetch);
polyfillGlobal("Headers", () => Headers);
polyfillGlobal("Request", () => Request);
polyfillGlobal("Response", () => Response);
polyfillGlobal("ReadableStream", () => ReadableStream);
polyfillGlobal("TextEncoder", () => TextEncoder);
polyfillGlobal("TextDecoder", () => TextDecoder);

export const BASE_HOST = process.env.EXPO_PUBLIC_API_URL;
