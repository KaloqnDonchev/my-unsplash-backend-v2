const { isNullAny, logIfNecessary } = require("../utils");
const { folderRelations } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const folderRelationsService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await folderRelations.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await folderRelations.scope(scope).findOne({
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
                return await folderRelations.scope(scope).findAll({
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
                const folderRelationToUpdate = await folderRelations.findOne({
                    where: whereObj
                });

                if (isNullAny(folderRelationToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.folderRelationsNotFoundError);
                }

                await folderRelations.update(
                    {
                        ...folderRelationToUpdate,
                        ...obj
                    },
                    {
                        where: { id: folderRelationToUpdate.id }
                    }
                );

                return await folderRelations.scope(scope).findOne({
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
                const folderRelationsToUpdate = await folderRelations.findAll({
                    where: whereObj
                });

                if (isNullAny(folderRelationsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.folderRelationsNotFoundError);
                }

                await folderRelations.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: folderRelationsToUpdate.map((u) => u.id) }
                    }
                );

                return await folderRelations.scope(scope).findAll({
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

module.exports = folderRelationsService;
