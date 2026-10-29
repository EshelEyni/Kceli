module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/featureRemoval.test.ts"],
  clearMocks: true,
};
