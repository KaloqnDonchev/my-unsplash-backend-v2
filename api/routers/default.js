const { defaultController } = require("../controllers");

module.exports = (router) => {
    router.get("/*", defaultController.get.any);

    return router;
};
