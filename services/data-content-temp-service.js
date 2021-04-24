const { isNullAny, logIfNecessary } = require("../utils");
const { dataContentTemp } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const dataContentTempService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await dataContentTemp.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await dataContentTemp.scope(scope).findOne({
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
                return await dataContentTemp.scope(scope).findAll({
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
                const dataContentTempToUpdate = await dataContentTemp.findOne({
                    where: whereObj
                });

                if (isNullAny(dataContentTempToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.dataContentTempNotFoundError);
                }

                await dataContentTemp.update(
                    {
                        ...dataContentTempToUpdate,
                        ...obj
                    },
                    {
                        where: { id: dataContentTempToUpdate.id }
                    }
                );

                return await dataContentTemp.scope(scope).findOne({
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
                const dataContentTempsToUpdate = await dataContentTemp.findAll({
                    where: whereObj
                });

                if (isNullAny(dataContentTempsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.dataContentTempNotFoundError);
                }

                await dataContentTemp.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: dataContentTempsToUpdate.map((u) => u.id) }
                    }
                );

                return await dataContentTemp.scope(scope).findAll({
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

module.exports = dataContentTempService;
