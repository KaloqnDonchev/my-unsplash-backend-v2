const { isNullAny, logIfNecessary } = require("../utils");
const { payments } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const paymentsService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await payments.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await payments.scope(scope).findOne({
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
                return await payments.scope(scope).findAll({
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
                const paymentToUpdate = await payments.findOne({
                    where: whereObj
                });

                if (isNullAny(paymentToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.paymentsNotFoundError);
                }

                await payments.update(
                    {
                        ...paymentToUpdate,
                        ...obj
                    },
                    {
                        where: { id: paymentToUpdate.id }
                    }
                );

                return await payments.scope(scope).findOne({
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
                const paymentsToUpdate = await payments.findAll({
                    where: whereObj
                });

                if (isNullAny(paymentsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.paymentsNotFoundError);
                }

                await payments.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: paymentsToUpdate.map((u) => u.id) }
                    }
                );

                return await payments.scope(scope).findAll({
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

module.exports = paymentsService;
