const { isNullAny, logIfNecessary } = require("../utils");
const { emailTokens } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const emailTokensService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await emailTokens.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await emailTokens.scope(scope).findOne({
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
                return await emailTokens.scope(scope).findAll({
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
                const emailTokenToUpdate = await emailTokens.findOne({
                    where: whereObj
                });

                if (isNullAny(emailTokenToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.emailTokensNotFoundError);
                }

                await emailTokens.update(
                    {
                        ...emailTokenToUpdate,
                        ...obj
                    },
                    {
                        where: { id: emailTokenToUpdate.id }
                    }
                );

                return await emailTokens.scope(scope).findOne({
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
                const emailTokensToUpdate = await emailTokens.findAll({
                    where: whereObj
                });

                if (isNullAny(emailTokensToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.emailTokensNotFoundError);
                }

                await emailTokens.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: emailTokensToUpdate.map((u) => u.id) }
                    }
                );

                return await emailTokens.scope(scope).findAll({
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

module.exports = emailTokensService;
