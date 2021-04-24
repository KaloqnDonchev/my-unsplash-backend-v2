const { isNullAny, logIfNecessary } = require("../utils");
const { selections } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const selectionsService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await selections.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await selections.scope(scope).findOne({
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
                return await selections.scope(scope).findAll({
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
                const selectionToUpdate = await selections.findOne({
                    where: whereObj
                });

                if (isNullAny(selectionToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.selectionsNotFoundError);
                }

                await selections.update(
                    {
                        ...selectionToUpdate,
                        ...obj
                    },
                    {
                        where: { id: selectionToUpdate.id }
                    }
                );

                return await selections.scope(scope).findOne({
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
                const selectionsToUpdate = await selections.findAll({
                    where: whereObj
                });

                if (isNullAny(selectionsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.selectionsNotFoundError);
                }

                await selections.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: selectionsToUpdate.map((u) => u.id) }
                    }
                );

                return await selections.scope(scope).findAll({
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

module.exports = selectionsService;
