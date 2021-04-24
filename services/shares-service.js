const { isNullAny, logIfNecessary } = require("../utils");
const { shares } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const sharesService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await shares.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await shares.scope(scope).findOne({
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
                return await shares.scope(scope).findAll({
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
                const shareToUpdate = await shares.findOne({
                    where: whereObj
                });

                if (isNullAny(shareToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.sharesNotFoundError);
                }

                await shares.update(
                    {
                        ...shareToUpdate,
                        ...obj
                    },
                    {
                        where: { id: shareToUpdate.id }
                    }
                );

                return await shares.scope(scope).findOne({
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
                const sharesToUpdate = await shares.findAll({
                    where: whereObj
                });

                if (isNullAny(sharesToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.sharesNotFoundError);
                }

                await shares.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: sharesToUpdate.map((u) => u.id) }
                    }
                );

                return await shares.scope(scope).findAll({
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

module.exports = sharesService;
