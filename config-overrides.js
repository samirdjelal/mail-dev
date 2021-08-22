const {override, addExternalBabelPlugin} = require("customize-cra");
module.exports = override(
	addExternalBabelPlugin(["@babel/plugin-proposal-nullish-coalescing-operator"])
);