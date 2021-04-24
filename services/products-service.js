const { isNullAny, logIfNecessary } = require("../utils");
const { products } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const productsService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await products.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await products.scope(scope).findOne({
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
                return await products.scope(scope).findAll({
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
                const productToUpdate = await products.findOne({
                    where: whereObj
                });

                if (isNullAny(productToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.productsNotFoundError);
                }

                await products.update(
                    {
                        ...productToUpdate,
                        ...obj
                    },
                    {
                        where: { id: productToUpdate.id }
                    }
                );

                return await products.scope(scope).findOne({
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
                const productsToUpdate = await products.findAll({
                    where: whereObj
                });

                if (isNullAny(productsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.productsNotFoundError);
                }

                await products.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: productsToUpdate.map((u) => u.id) }
                    }
                );

                return await products.scope(scope).findAll({
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

module.exports = productsService;
