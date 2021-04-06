;
const routers = {
    userRouter: require("./user.js"),
    projectRouter: require("./project.js"),
    documentRouter: require("./document.js"),
    templateRouter: require("./template.js"),
    analyticsRouter: require("./analytics.js"),
    defaultRouter: require("./default.js"),
};


module.exports = {
    setRouters: (express, app) => {
        Object.values(routers)
            .map(router => router(express.Router()))
            .map(router => app.use("/", router));
    },
}