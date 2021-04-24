const { isNullAny, logIfNecessary } = require("../utils");
const { txManager } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const txManagerService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await txManager.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await txManager.scope(scope).findOne({
                    where: whereObj,
                    ...options
                });
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        },
        many: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await txManager.scope(scope).findAll({
                    where: whereObj,
                    ...options
                });
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    update: {
        one: async (whereObj, obj, scope = defaultScope, options = {}) => {
            try {
                const txManagerToUpdate = await txManager.findOne({
                    where: whereObj
                });

                if (isNullAny(txManagerToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.txManagerNotFoundError);
                }

                await txManager.update(
                    {
                        ...txManagerToUpdate,
                        ...obj
                    },
                    {
                        where: { id: txManagerToUpdate.id }
                    }
                );

                return await txManager.scope(scope).findOne({
                    where: whereObj,
                    ...options
                });
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        },
        many: async (whereObj, obj, scope = defaultScope, options = {}) => {
            try {
                const txManagersToUpdate = await txManager.findAll({
                    where: whereObj
                });

                if (isNullAny(txManagersToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.txManagerNotFoundError);
                }

                await txManager.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: txManagersToUpdate.map((u) => u.id) }
                    }
                );

                return await txManager.scope(scope).findAll({
                    where: whereObj,
                    ...options
                });
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    }
};

module.exports = txManagerService;
