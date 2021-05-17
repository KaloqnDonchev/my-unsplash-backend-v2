const express = require("express");
const { backendPort } = require("./config.js");
const { logger } = require("./logger");

const app = express();

require("./db")
    .startDBConnection()
    .then(() => {
        require("./api")(express, app);

        app.listen(backendPort, () => {
            logger.info(`MyUnsplash is now running on http://localhost:${backendPort}`);
        });
    })
    .catch((error) => {
        logger.error(error);
    });
