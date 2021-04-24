const { isNullAny, logIfNecessary } = require("../utils");
const { dataContent } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const dataContentService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await dataContent.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await dataContent.scope(scope).findOne({
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
                return await dataContent.scope(scope).findAll({
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
                const dataContentToUpdate = await dataContent.findOne({
                    where: whereObj
                });

                if (isNullAny(dataContentToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.dataContentNotFoundError);
                }

                await dataContent.update(
                    {
                        ...dataContentToUpdate,
                        ...obj
                    },
                    {
                        where: { id: dataContentToUpdate.id }
                    }
                );

                return await dataContent.scope(scope).findOne({
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
                const dataContentsToUpdate = await dataContent.findAll({
                    where: whereObj
                });

                if (isNullAny(dataContentsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.dataContentNotFoundError);
                }

                await dataContent.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: dataContentsToUpdate.map((u) => u.id) }
                    }
                );

                return await dataContent.scope(scope).findAll({
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

module.exports = dataContentService;
