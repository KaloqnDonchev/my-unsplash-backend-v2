const { isNullAny, logIfNecessary } = require("../utils");
const { encryptionExchange } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const encryptionExchangeService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await encryptionExchange.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await encryptionExchange.scope(scope).findOne({
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
                return await encryptionExchange.scope(scope).findAll({
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
                const encryptionExchangeToUpdate = await encryptionExchange.findOne({
                    where: whereObj
                });

                if (isNullAny(encryptionExchangeToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.encryptionExchangeNotFoundError);
                }

                await encryptionExchange.update(
                    {
                        ...encryptionExchangeToUpdate,
                        ...obj
                    },
                    {
                        where: { id: encryptionExchangeToUpdate.id }
                    }
                );

                return await encryptionExchange.scope(scope).findOne({
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
                const encryptionExchangesToUpdate = await encryptionExchange.findAll({
                    where: whereObj
                });

                if (isNullAny(encryptionExchangesToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.encryptionExchangeNotFoundError);
                }

                await encryptionExchange.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: encryptionExchangesToUpdate.map((u) => u.id) }
                    }
                );

                return await encryptionExchange.scope(scope).findAll({
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

module.exports = encryptionExchangeService;
