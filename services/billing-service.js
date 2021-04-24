const { isNullAny, logIfNecessary } = require("../utils");
const { billing } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const billingService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await billing.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await billing.scope(scope).findOne({
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
                return await billing.scope(scope).findAll({
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
                const billingToUpdate = await billing.findOne({
                    where: whereObj
                });

                if (isNullAny(billingToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.billingNotFoundError);
                }

                await billing.update(
                    {
                        ...billingToUpdate,
                        ...obj
                    },
                    {
                        where: { id: billingToUpdate.id }
                    }
                );

                return await billing.scope(scope).findOne({
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
                const billingsToUpdate = await billing.findAll({
                    where: whereObj
                });

                if (isNullAny(billingsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.billingNotFoundError);
                }

                await billing.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: billingsToUpdate.map((u) => u.id) }
                    }
                );

                return await billing.scope(scope).findAll({
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

module.exports = billingService;
