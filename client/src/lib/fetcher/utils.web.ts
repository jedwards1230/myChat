const IS_DEV = process.env.NODE_ENV === "development";

export const BASE_HOST = IS_DEV ? "http://localhost:3000" : "";
