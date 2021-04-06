module.exports = process.env.NODE_ENV === "test" ? require("../config.js").dbTest : require("../config.js").db;
