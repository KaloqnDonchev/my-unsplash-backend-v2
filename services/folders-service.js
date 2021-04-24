const { isNullAny, logIfNecessary } = require("../utils");
const { folders } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const foldersService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await folders.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await folders.scope(scope).findOne({
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
                return await folders.scope(scope).findAll({
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
                const folderToUpdate = await folders.findOne({
                    where: whereObj
                });

                if (isNullAny(folderToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.foldersNotFoundError);
                }

                await folders.update(
                    {
                        ...folderToUpdate,
                        ...obj
                    },
                    {
                        where: { id: folderToUpdate.id }
                    }
                );

                return await folders.scope(scope).findOne({
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
                const foldersToUpdate = await folders.findAll({
                    where: whereObj
                });

                if (isNullAny(foldersToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.foldersNotFoundError);
                }

                await folders.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: foldersToUpdate.map((u) => u.id) }
                    }
                );

                return await folders.scope(scope).findAll({
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

module.exports = foldersService;
