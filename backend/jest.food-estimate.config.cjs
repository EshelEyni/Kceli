module.exports = {
  preset: "ts-jest", testEnvironment: "node", roots: ["<rootDir>/src"],
  testMatch: ["**/foodEstimate*.test.ts"], clearMocks: true,
};
