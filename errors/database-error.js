const ReCheckError = require("./default.js");

class DatabaseError extends ReCheckError {
    constructor(errorMessageObj, field = null) {
        super(errorMessageObj, field);
    }
}

module.exports = DatabaseError;
