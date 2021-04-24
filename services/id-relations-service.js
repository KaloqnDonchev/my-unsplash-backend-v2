const { isNullAny, logIfNecessary } = require("../utils");
const { idRelations } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const idRelationsService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await idRelations.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await idRelations.scope(scope).findOne({
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
                return await idRelations.scope(scope).findAll({
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
                const idRelationToUpdate = await idRelations.findOne({
                    where: whereObj
                });

                if (isNullAny(idRelationToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.idRelationsNotFoundError);
                }

                await idRelations.update(
                    {
                        ...idRelationToUpdate,
                        ...obj
                    },
                    {
                        where: { id: idRelationToUpdate.id }
                    }
                );

                return await idRelations.scope(scope).findOne({
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
                const idRelationsToUpdate = await idRelations.findAll({
                    where: whereObj
                });

                if (isNullAny(idRelationsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.idRelationsNotFoundError);
                }

                await idRelations.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: idRelationsToUpdate.map((u) => u.id) }
                    }
                );

                return await idRelations.scope(scope).findAll({
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

module.exports = idRelationsService;
