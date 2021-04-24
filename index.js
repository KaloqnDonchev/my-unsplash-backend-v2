require("./key-generator.js"); // create pub private keys for jwt if not existent

const express = require("express");
const { backendPort } = require("./config.js").server;

const { logger } = require("./logger");

const app = express();

require("./db")
    .startDBConnection()
    .then(() => {
        require("./api")(express, app);

        app.listen(backendPort, () => {
            logger.info(`ReCheck is now running on http://localhost:${backendPort}`);
        });
    })
    .catch((error) => {
        logger.error(error);
    });

process.on("uncaughtException", (error) => logger.error("uncaughtException", error));

// catches ctrl+c event
process.on("SIGINT", exitHandler.bind("SIGINT", null, { exit: true }));
// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind("SIGUSR1", null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind("SIGUSR2", null, { exit: true }));
// do something when app is closing
process.on("exit", exitHandler.bind("exit", null, { cleanup: true }));

function exitHandler(event, options, exitCode) {
    logger.info(event);
    if (options.exit) {
        logger.info("exit");
        process.exit();
    } else if (options.cleanup) {
        if (exitCode || exitCode === 0) {
            logger.info("clean with exitCode", exitCode);
        } else {
            logger.info("clean");
        }

        logger.clearLogger();
    } else if (exitCode || exitCode === 0) {
        logger.info("no clean with exitCode", exitCode);
    }
}
