const ReCheckError = require("./default.js");

class ServiceError extends ReCheckError {
    constructor(errorMessageObj, field = null) {
        super(errorMessageObj, field);
    }
}

module.exports = ServiceError;
