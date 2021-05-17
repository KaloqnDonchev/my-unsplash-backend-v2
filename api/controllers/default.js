module.exports = {
    get: {
        any(req, res, next) {
            res.sendStatus(404);
        }
    }
};
