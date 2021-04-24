const { isNullAny, logIfNecessary } = require("../utils");
const { contacts } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const contactsService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await contacts.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await contacts.scope(scope).findOne({
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
                return await contacts.scope(scope).findAll({
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
                const contactToUpdate = await contacts.findOne({
                    where: whereObj
                });

                if (isNullAny(contactToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.contactsNotFoundError);
                }

                await contacts.update(
                    {
                        ...contactToUpdate,
                        ...obj
                    },
                    {
                        where: { id: contactToUpdate.id }
                    }
                );

                return await contacts.scope(scope).findOne({
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
                const contactsToUpdate = await contacts.findAll({
                    where: whereObj
                });

                if (isNullAny(contactsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.contactsNotFoundError);
                }

                await contacts.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: contactsToUpdate.map((u) => u.id) }
                    }
                );

                return await contacts.scope(scope).findAll({
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

module.exports = contactsService;
