const { isNullAny, logIfNecessary } = require("../utils");
const { rtnTokenCb } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const rtnTokenCbService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await rtnTokenCb.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await rtnTokenCb.scope(scope).findOne({
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
                return await rtnTokenCb.scope(scope).findAll({
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
                const rtnTokenCbToUpdate = await rtnTokenCb.findOne({
                    where: whereObj
                });

                if (isNullAny(rtnTokenCbToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.rtnTokenCbNotFoundError);
                }

                await rtnTokenCb.update(
                    {
                        ...rtnTokenCbToUpdate,
                        ...obj
                    },
                    {
                        where: { id: rtnTokenCbToUpdate.id }
                    }
                );

                return await rtnTokenCb.scope(scope).findOne({
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
                const rtnTokenCbsToUpdate = await rtnTokenCb.findAll({
                    where: whereObj
                });

                if (isNullAny(rtnTokenCbsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.rtnTokenCbNotFoundError);
                }

                await rtnTokenCb.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: rtnTokenCbsToUpdate.map((u) => u.id) }
                    }
                );

                return await rtnTokenCb.scope(scope).findAll({
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

rtnTokenCbService.createLoginChallenge = async (returnChallenge = null, returnUrl = null) => {
    try {
        const uuid = UUIDv1();

        const challenge = getHash(uuid);

        if (!isNullAny(returnChallenge, returnUrl)) {
            const rtnTokenCbObject = { challenge, returnChallenge, returnUrl };
            await rtnTokenCbService.create.single(rtnTokenCbObject);
        }

        return challenge;
    } catch (error) {
        logIfNecessary(error);
        throw error;
    }
};

module.exports = rtnTokenCbService;
