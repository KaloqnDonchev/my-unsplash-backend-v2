const xChainError = require("./default.js");

class UserServiceError extends xChainError {
    constructor(message, code, field = null) {
        super(message, code, field);
    }
}

module.exports = {UserServiceError};
