/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  maxWorkers: 1,
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "test/(.*)": "<rootDir>/test/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/config/"]
};
