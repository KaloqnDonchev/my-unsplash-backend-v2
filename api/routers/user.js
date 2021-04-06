const {userController} = require("../controllers");
const {checkAuth} = require("../../utils/jwt");

module.exports = (router) => {
    router.post("/login", userController.post.login);

    router.get("/user", checkAuth, userController.get.getUser);
    router.put("/user", checkAuth, userController.put.updateCredentials);
    router.post("/user", userController.post.register);

    router.get("/user/recheck/:userId/:returnChallenge/:emailVerifyToken", userController.get.getRecheck);
    router.put("/user/recheck", userController.put.updateRecheck);

    router.put("/user/finalize", userController.put.verifyUserEmailAndPutRecheckInfo);

    router.get("/user/personal", checkAuth, userController.get.getUserInfo);
    router.put("/user/personal", checkAuth, userController.put.updateUserInfo);

    router.get("/user/settings", checkAuth, userController.get.getSettings);
    router.put("/user/settings", checkAuth, userController.put.updateSettings);

    //TODO add preferences get
    router.put("/user/preferences", checkAuth, userController.put.updateUserPreferences);

    router.get("/company", checkAuth, userController.get.getCompanyInfo);
    router.put("/company", checkAuth, userController.put.updateCompanyInfo);

    return router;
};
