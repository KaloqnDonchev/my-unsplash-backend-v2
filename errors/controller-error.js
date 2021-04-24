const ReCheckError = require("./default.js");

class ControllerError extends ReCheckError {
    constructor(errorMessageObj, field = null) {
        super(errorMessageObj, field);
    }
}

module.exports = ControllerError;