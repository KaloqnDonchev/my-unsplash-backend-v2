const ReCheckError = require("./default.js");

class EmailError extends ReCheckError {
    constructor(errorMessageObj, field = null) {
        super(errorMessageObj, field);
    }
}

module.exports = EmailError;
