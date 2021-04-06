class xChainError extends Error {
    constructor(message, code, field = null) {
        super();
        this.message = message;
        this.status = "error";
        this.code = code;

        if (field) {
            this.field = field;
        }
    }
}

module.exports = xChainError;
