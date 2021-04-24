const ReCheckError = require("./default.js");

class ChainError extends ReCheckError {
    constructor(errorMessageObj, field = null) {
        super(errorMessageObj, field);
    }
}

module.exports = ChainError;
