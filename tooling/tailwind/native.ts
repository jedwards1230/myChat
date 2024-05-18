import type { Config } from "tailwindcss";

import base from "../eslint/base";

export default {
  content: base.content,
  presets: [base],
  theme: {},
} satisfies Config;