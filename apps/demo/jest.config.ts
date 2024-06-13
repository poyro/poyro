import path from "path";

import type { Config } from "jest";
// import nextJest from "next/jest";

// const createJestConfig = nextJest({
//   // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
//   dir: "./",
// });

console.log(
  `${path.join(__dirname, "../..")}/node_modules/.pnpm/(?!(node-llama-cpp)@)`
);

const esmModules = ["@poyro/jest", "node-llama-cpp"];

// Add any custom config to be passed to Jest
const config: Config = {
  preset: "@repo/jest-presets/browser",
  coverageProvider: "v8",
  // testEnvironment: "jest-environment-jsdom",
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": ["babel-jest", { presets: ["@babel/preset-env"] }],
  },
  transformIgnorePatterns: [
    // "<rootDir>/node_modules/.pnpm/(?!(node-llama-cpp)@)",
    // `${path.join(__dirname, "../..")}/node_modules/.pnpm/(?!(node-llama-cpp)@)`,
    // "node_modules/?!(node-llama-cpp)",
    `node_modules/(?!(?:.pnpm/)?(${esmModules.join("|")}))`,
    // "/node_modules/(?!node-llama-cpp).+\\.js$",
  ],
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// export default createJestConfig(config);
