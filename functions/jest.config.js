module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^types$": "<rootDir>/src/types/index.d.ts",
    "^values$": "<rootDir>/src/values/index.ts",
    "^utils$": "<rootDir>/src/utils/index.ts",
  },
  testMatch: ["<rootDir>/**/*.test.ts"],
};
