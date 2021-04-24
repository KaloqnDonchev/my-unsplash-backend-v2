const { isNullAny, logIfNecessary } = require("../utils");
const { txCompleted } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const txCompletedService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await txCompleted.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await txCompleted.scope(scope).findOne({
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
                return await txCompleted.scope(scope).findAll({
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
                const txCompletedToUpdate = await txCompleted.findOne({
                    where: whereObj
                });

                if (isNullAny(txCompletedToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.txCompletedNotFoundError);
                }

                await txCompleted.update(
                    {
                        ...txCompletedToUpdate,
                        ...obj
                    },
                    {
                        where: { id: txCompletedToUpdate.id }
                    }
                );

                return await txCompleted.scope(scope).findOne({
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
                const txCompletedsToUpdate = await txCompleted.findAll({
                    where: whereObj
                });

                if (isNullAny(txCompletedsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.txCompletedNotFoundError);
                }

                await txCompleted.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: txCompletedsToUpdate.map((u) => u.id) }
                    }
                );

                return await txCompleted.scope(scope).findAll({
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

module.exports = txCompletedService;
