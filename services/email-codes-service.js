const { isNullAny, logIfNecessary } = require("../utils");
const { emailCodes } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const emailCodesService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await emailCodes.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await emailCodes.scope(scope).findOne({
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
                return await emailCodes.scope(scope).findAll({
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
                const emailCodeToUpdate = await emailCodes.findOne({
                    where: whereObj
                });

                if (isNullAny(emailCodeToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.emailCodesNotFoundError);
                }

                await emailCodes.update(
                    {
                        ...emailCodeToUpdate,
                        ...obj
                    },
                    {
                        where: { id: emailCodeToUpdate.id }
                    }
                );

                return await emailCodes.scope(scope).findOne({
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
                const emailCodesToUpdate = await emailCodes.findAll({
                    where: whereObj
                });

                if (isNullAny(emailCodesToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.emailCodesNotFoundError);
                }

                await emailCodes.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: emailCodesToUpdate.map((u) => u.id) }
                    }
                );

                return await emailCodes.scope(scope).findAll({
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

module.exports = emailCodesService;
