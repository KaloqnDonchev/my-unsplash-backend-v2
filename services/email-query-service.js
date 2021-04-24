const { isNullAny, logIfNecessary } = require("../utils");
const { emailQuery } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const emailQueryService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await emailQuery.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await emailQuery.scope(scope).findOne({
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
                return await emailQuery.scope(scope).findAll({
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
                const emailQueryToUpdate = await emailQuery.findOne({
                    where: whereObj
                });

                if (isNullAny(emailQueryToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.emailQueryNotFoundError);
                }

                await emailQuery.update(
                    {
                        ...emailQueryToUpdate,
                        ...obj
                    },
                    {
                        where: { id: emailQueryToUpdate.id }
                    }
                );

                return await emailQuery.scope(scope).findOne({
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
                const emailQueriesToUpdate = await emailQuery.findAll({
                    where: whereObj
                });

                if (isNullAny(emailQueriesToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.emailQueryNotFoundError);
                }

                await emailQuery.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: emailQueriesToUpdate.map((u) => u.id) }
                    }
                );

                return await emailQuery.scope(scope).findAll({
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

module.exports = emailQueryService;
