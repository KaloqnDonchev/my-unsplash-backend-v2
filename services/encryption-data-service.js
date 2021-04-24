const { isNullAny, logIfNecessary } = require("../utils");
const { encryptionData } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const encryptionDataService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await encryptionData.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await encryptionData.scope(scope).findOne({
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
                return await encryptionData.scope(scope).findAll({
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
                const encryptionDataToUpdate = await encryptionData.findOne({
                    where: whereObj
                });

                if (isNullAny(encryptionDataToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.encryptionDataNotFoundError);
                }

                await encryptionData.update(
                    {
                        ...encryptionDataToUpdate,
                        ...obj
                    },
                    {
                        where: { id: encryptionDataToUpdate.id }
                    }
                );

                return await encryptionData.scope(scope).findOne({
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
                const encryptionDatasToUpdate = await encryptionData.findAll({
                    where: whereObj
                });

                if (isNullAny(encryptionDatasToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.encryptionDataNotFoundError);
                }

                await encryptionData.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: encryptionDatasToUpdate.map((u) => u.id) }
                    }
                );

                return await encryptionData.scope(scope).findAll({
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

module.exports = encryptionDataService;
