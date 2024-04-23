module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        //"react-app",
        //"plugin:@tanstack/eslint-plugin-query/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: { project: ["./tsconfig.json"] },
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/strict-boolean-expressions": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/ban-ts-comment": 0,
        "react-hooks/exhaustive-deps": "off",
        "@typescript-eslint/no-redeclare": "off",
    },
    ignorePatterns: [
        "src/**/*.test.ts",
        "tailwind.config.js",
        "metro.config.js",
        "babel.config.js",
        "app.config.ts",
    ],
};
