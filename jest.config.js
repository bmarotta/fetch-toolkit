// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    // [...]
    // Replace `ts-jest` with the preset you want to use
    // from the above list
    preset: "ts-jest",
    collectCoverageFrom: ["<rootDir>/packages/**/*.{tsx,ts}", "!**/*.{js,d.ts}"],
    coverageReporters: ["lcov", "json-summary"],
};
