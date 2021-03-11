module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	globals: {
		"ts-jest": {
			tsConfigFile: "tsconfig.json",
		},
	},
	moduleFileExtensions: ["ts", "js"],
	testMatch: ["**/src/**/*.test.(ts|js)"],
	globalSetup: "../test-utils/globalSetup.js",
};
