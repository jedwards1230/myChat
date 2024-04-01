import "@azure/core-asynciterator-polyfill";
import { ReadableStream } from "web-streams-polyfill";
import { TextEncoder, TextDecoder } from "text-encoding";
import { setupURLPolyfill } from "react-native-url-polyfill";

const { polyfillGlobal } = require("react-native/Libraries/Utilities/PolyfillFunctions");
const { fetch, Headers, Request, Response } = require("react-native-fetch-api");

setupURLPolyfill();
polyfillGlobal("fetch", () => fetch);
polyfillGlobal("Headers", () => Headers);
polyfillGlobal("Request", () => Request);
polyfillGlobal("Response", () => Response);
polyfillGlobal("ReadableStream", () => ReadableStream);
polyfillGlobal("TextEncoder", () => TextEncoder);
polyfillGlobal("TextDecoder", () => TextDecoder);
