module.exports = {
    root: true,
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: { project: ["./tsconfig.json"] },
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/strict-boolean-expressions": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/ban-ts-comment": 0,
    },
    ignorePatterns: ["src/**/*.test.ts", "tests/**/*", "jest.config.js"],
};
