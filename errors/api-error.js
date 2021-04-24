const ReCheckError = require("./default.js");

class ApiError extends ReCheckError {
    constructor(errorMessageObj, field = null) {
        super(errorMessageObj, field);
    }
}

module.exports = ApiError;
