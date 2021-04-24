class ReCheckError extends Error {
    constructor(errorMessageObj, field = null) {
        super();
        this.message = errorMessageObj.message;
        this.status = "error";
        this.code = errorMessageObj.code;

        if (field) {
            this.field = field;
        }
    }
}

module.exports = ReCheckError;
