const { isNullAny, logIfNecessary } = require("../utils");
const { data } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const dataService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await data.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await data.scope(scope).findOne({
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
                return await data.scope(scope).findAll({
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
                const dataToUpdate = await data.findOne({
                    where: whereObj
                });

                if (isNullAny(dataToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.dataNotFoundError);
                }

                await data.update(
                    {
                        ...dataToUpdate,
                        ...obj
                    },
                    {
                        where: { id: dataToUpdate.id }
                    }
                );

                return await data.scope(scope).findOne({
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
                const datasToUpdate = await data.findAll({
                    where: whereObj
                });

                if (isNullAny(datasToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.dataNotFoundError);
                }

                await data.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: datasToUpdate.map((u) => u.id) }
                    }
                );

                return await data.scope(scope).findAll({
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

module.exports = dataService;
