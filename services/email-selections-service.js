const { isNullAny, logIfNecessary } = require("../utils");
const { emailSelections } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const emailSelectionsService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await emailSelections.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await emailSelections.scope(scope).findOne({
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
                return await emailSelections.scope(scope).findAll({
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
                const emailSelectionToUpdate = await emailSelections.findOne({
                    where: whereObj
                });

                if (isNullAny(emailSelectionToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.emailSelectionsNotFoundError);
                }

                await emailSelections.update(
                    {
                        ...emailSelectionToUpdate,
                        ...obj
                    },
                    {
                        where: { id: emailSelectionToUpdate.id }
                    }
                );

                return await emailSelections.scope(scope).findOne({
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
                const emailSelectionsToUpdate = await emailSelections.findAll({
                    where: whereObj
                });

                if (isNullAny(emailSelectionsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.emailSelectionsNotFoundError);
                }

                await emailSelections.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: emailSelectionsToUpdate.map((u) => u.id) }
                    }
                );

                return await emailSelections.scope(scope).findAll({
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

module.exports = emailSelectionsService;
