const { loginController } = require("../controllers");
const { checkAuth } = require("../../utils").jwt;

module.exports = (router) => {
    router.get(
        "/login/challenge/:returnChallenge/:returnUrl",
        loginController.get.getLoginChallenge
    );
    router.get("/login/challenge", loginController.get.getLoginChallenge);
    router.post("/login/mobile", loginController.post.postMobileLogin);

    return router;
};
