const cors = require("cors");
const bodyParser = require("body-parser");
const { maxPostRequestSize } = require("../config");

module.exports = (express, app) => {
    app.use(bodyParser.json({ limit: maxPostRequestSize }));
    app.use(bodyParser.urlencoded({ limit: maxPostRequestSize, extended: false }));
    app.use(express.json());
    app.use(cors({ origin: "*", credentials: true }));

    require("./swagger").setSwagger(app);
    require("./routers").setRouters(express, app);
};
