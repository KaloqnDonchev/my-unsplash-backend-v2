const { isNullAny, logIfNecessary } = require("../utils");
const { dataCategories } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const dataCategoriesService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await dataCategories.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await dataCategories.scope(scope).findOne({
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
                return await dataCategories.scope(scope).findAll({
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
                const dataCategoryToUpdate = await dataCategories.findOne({
                    where: whereObj
                });

                if (isNullAny(dataCategoryToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.dataCategoriesNotFoundError);
                }

                await dataCategories.update(
                    {
                        ...dataCategoryToUpdate,
                        ...obj
                    },
                    {
                        where: { id: dataCategoryToUpdate.id }
                    }
                );

                return await dataCategories.scope(scope).findOne({
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
                const dataCategoriesToUpdate = await dataCategories.findAll({
                    where: whereObj
                });

                if (isNullAny(dataCategoriesToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.dataCategoriesNotFoundError);
                }

                await dataCategories.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: dataCategoriesToUpdate.map((u) => u.id) }
                    }
                );

                return await dataCategories.scope(scope).findAll({
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

module.exports = dataCategoriesService;
