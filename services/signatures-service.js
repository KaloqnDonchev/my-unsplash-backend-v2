const { isNullAny, logIfNecessary } = require("../utils");
const { signatures } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const signaturesService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await signatures.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await signatures.scope(scope).findOne({
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
                return await signatures.scope(scope).findAll({
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
                const signatureToUpdate = await signatures.findOne({
                    where: whereObj
                });

                if (isNullAny(signatureToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.signaturesNotFoundError);
                }

                await signatures.update(
                    {
                        ...signatureToUpdate,
                        ...obj
                    },
                    {
                        where: { id: signatureToUpdate.id }
                    }
                );

                return await signatures.scope(scope).findOne({
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
                const signaturesToUpdate = await signatures.findAll({
                    where: whereObj
                });

                if (isNullAny(signaturesToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.signaturesNotFoundError);
                }

                await signatures.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: signaturesToUpdate.map((u) => u.id) }
                    }
                );

                return await signatures.scope(scope).findAll({
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

module.exports = signaturesService;
