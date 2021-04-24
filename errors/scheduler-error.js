const ReCheckError = require("./default.js");

class SchedulerError extends ReCheckError {
    constructor(errorMessageObj, field = null) {
        super(errorMessageObj, field);
    }
}

module.exports = SchedulerError;
