const routers = {
    userRouter: require("./user.js"),
    defaultRouter: require("./default.js")
};

module.exports = {
    setRouters: (express, app) => {
        Object.values(routers)
            .map((router) => router(express.Router()))
            .map((router) => app.use("/", router));
    }
};
