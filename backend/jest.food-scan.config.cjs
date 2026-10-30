module.exports = {
  preset: "ts-jest", testEnvironment: "node", roots: ["<rootDir>/src"],
  testMatch: ["**/foodScan*.test.ts"], clearMocks: true,
};
