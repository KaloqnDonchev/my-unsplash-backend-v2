const { userController } = require("../controllers");
const { checkAuth } = require("../../utils").jwt;

module.exports = (router) => {
    router.post("/login", userController.post.login);
    return router;
};
