const { exec } = require("child_process");
const { Sequelize, ConnectionError } = require("sequelize");
const dbConfig = require("./config.js");
const modelDefiners = require("./models");
const { applyDBRelations } = require("./relations");
const { logger } = require("../logger");

let isFirstDbConnectionError = true;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.shouldLog ? (error) => logger.sequelize(error) : false,
    define: {
        timestamps: true,
        freezeTableName: true
    }
});
try {
    Object.values(modelDefiners).forEach((m) => m(sequelize));
} catch (e) {
    console.log(e);
}

applyDBRelations(sequelize);

async function startDBConnection() {
    return new Promise((resolve, reject) => {
        sequelize
            .authenticate()
            .then(() => {
                logger.info("DB connection has been established successfully.");
                sequelize
                    .sync({ force: dbConfig.shouldForceDBSync })
                    .then(() => {
                        if (dbConfig.shouldForceDBSync && dbConfig.shouldSeedDemoData) {
                            exec("npx sequelize-cli db:seed:all --debug", (error) => {
                                if (error) {
                                    logger.error(error);
                                    reject(`DB sync and seed error: ${error}`);
                                }
                                logger.info("DB sync and seed has been successfully.");
                                resolve();
                            });
                        } else {
                            logger.info("DB sync has been successful.");
                            resolve();
                        }
                    })
                    .catch((error) => {
                        logger.error(error);
                        reject(`Unable to sync database: ${error}`);
                    });
            })
            .catch((error) => {
                if (error instanceof ConnectionError && isFirstDbConnectionError) {
                    isFirstDbConnectionError = false;
                    exec("npx sequelize-cli db:create", (err) => {
                        if (err) {
                            logger.error(err);
                            reject(`Unable to create database: ${error}`);
                        } else {
                            logger.info("Database successfully created.");
                            resolve(startDBConnection());
                        }
                    });
                } else {
                    logger.error(error);
                    reject(`Unable to connect to the database: ${error}`);
                }
            });
    });
}

async function stopDBConnection() {
    return new Promise((resolve, reject) => {
        sequelize
            .close()
            .then(() => {
                logger.info("DB connection has been shut down.");
                resolve();
            })
            .catch((error) => {
                logger.error(error);
                reject(`Unable to connect to the database: ${error}`);
            });
    });
}

function getDBModels() {
    return sequelize.models;
}

module.exports = {
    sequelize,
    startDBConnection,
    stopDBConnection,
    getDBModels
};
