const { isNullAny, logIfNecessary } = require("../utils");
const { dataAccess } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const dataAccessService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await dataAccess.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await dataAccess.scope(scope).findOne({
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
                return await dataAccess.scope(scope).findAll({
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
                const dataAccessToUpdate = await dataAccess.findOne({
                    where: whereObj
                });

                if (isNullAny(dataAccessToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.dataAccessNotFoundError);
                }

                await dataAccess.update(
                    {
                        ...dataAccessToUpdate,
                        ...obj
                    },
                    {
                        where: { id: dataAccessToUpdate.id }
                    }
                );

                return await dataAccess.scope(scope).findOne({
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
                const dataAccessesToUpdate = await dataAccess.findAll({
                    where: whereObj
                });

                if (isNullAny(dataAccessesToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.dataAccessNotFoundError);
                }

                await dataAccess.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: dataAccessesToUpdate.map((u) => u.id) }
                    }
                );

                return await dataAccess.scope(scope).findAll({
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

module.exports = dataAccessService;
