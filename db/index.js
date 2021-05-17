const { exec } = require("child_process");
const { Sequelize } = require("sequelize");
const { db } = require("../config.js");
const modelDefiners = require("./models");
const { logger } = require("../logger");

let isFirstDbConnectionError = true;

const sequelize = new Sequelize(db.database, db.username, db.password, {
    host: db.host,
    dialect: db.dialect,
    logging: db.shouldLog ? (error) => console.log(error) : false,
    define: {
        timestamps: true,
        freezeTableName: true
    }
});

Object.values(modelDefiners).forEach((m) => m(sequelize));

async function startDBConnection() {
    new Promise((resolve, reject) => {
        sequelize
            .authenticate()
            .then(() => {
                sequelize
                    .sync({ force: db.shouldForceDBSync })
                    .then(() => {
                        logger.info("DB sync has been successfull.");
                        resolve();
                    })
                    .catch((error) => {
                        logger.error(error);
                        reject(`Unable to sync database: ${error}`);
                    });
            })
            .catch((error) => {
                if (isFirstDbConnectionError) {
                    isFirstDbConnectionError = false;
                    exec("npx sequelize-cli db:create", (err) => {
                        if (err) {
                            logger.error(error);
                            reject(`Unable to create database: ${error}`);
                        } else {
                            logger.error(error);
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
