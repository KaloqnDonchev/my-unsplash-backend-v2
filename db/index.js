const {exec} = require('child_process');
const {Sequelize} = require("sequelize");

const dbConfig = require("./config.js");
const modelDefiners = require("./models");
const {applyDBRelations} = require("./relations");
const {logger} = require("../logger");


const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: dbConfig.shouldLog ? (error) => logger.sequelize(error) : false,
    },
);

Object.values(modelDefiners).forEach((m) => m(sequelize));

applyDBRelations(sequelize);


module.exports = {
    sequelize,
    startDBConnection: () =>
        new Promise((resolve, reject) => {
            sequelize
                .authenticate()
                .then(() => {
                    logger.info("DB connection has been established successfully.");

                    sequelize
                        .sync({force: dbConfig.shouldForceDBSync})
                        .then(() => {
                            if (dbConfig.shouldForceDBSync && dbConfig.shouldSeedDemoData) {
                                exec('npx sequelize-cli db:seed:all --debug', (error) => {
                                    if (error) {
                                        logger.error(error);
                                    }
                                    logger.info("DB sync and seed has been successfully.");
                                    resolve();
                                });
                            } else {
                                logger.info("DB sync has been successfully.");
                                resolve();
                            }
                        })
                        .catch((error) => {
                            logger.error(error);
                            reject(`Unable to sync database: ${error}`);
                        });
                })
                .catch((error) => {
                    logger.error(error);
                    reject(`Unable to connect to the database: ${error}`);
                });
        }),
    stopDBConnection: () =>
        new Promise((resolve, reject) => {
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
        }),
    getDBModels: () => sequelize.models,
};
