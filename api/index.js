const cors = require("cors");

const config = require("../config");

module.exports = (express, app) => {
    app.use(
        cors({
            credentials: "include",
            origin: config.isDev ? "*" : config.origins
        })
    );

    app.use(express.json({ limit: config.maxPostRequestSize }));

    app.use(
        express.urlencoded({
            extended: true,
            parameterLimit: 50000,
            limit: config.maxPostRequestSize
        })
    );

    app.set("trust proxy", 1); // trust first proxy

    app.disable("x-powered-by"); // hide express server

    require("./swagger").setSwagger(app);
    require("./routers").setRouters(express, app);

    app.use(require("./middlewares").errorHandler);
};
