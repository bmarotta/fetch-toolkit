// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    // [...]
    // Replace `ts-jest` with the preset you want to use
    // from the above list
    preset: "ts-jest",
    collectCoverageFrom: ["<rootDir>/src/**/*.{tsx,ts}", "!**/*.{js,d.ts}", "!**/index.ts"],
    coverageReporters: ["lcov", "json-summary"],
};
