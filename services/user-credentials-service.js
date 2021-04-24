const { isNullAny, logIfNecessary } = require("../utils");
const { userCredentials } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const userCredentialsService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await userCredentials.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await userCredentials.scope(scope).findOne({
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
                return await userCredentials.scope(scope).findAll({
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
                const userCredentialToUpdate = await userCredentials.findOne({
                    where: whereObj
                });

                if (isNullAny(userCredentialToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.userCredentialsNotFoundError);
                }

                await userCredentials.update(
                    {
                        ...userCredentialToUpdate,
                        ...obj
                    },
                    {
                        where: { id: userCredentialToUpdate.id }
                    }
                );

                return await userCredentials.scope(scope).findOne({
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
                const userCredentialsToUpdate = await userCredentials.findAll({
                    where: whereObj
                });

                if (isNullAny(userCredentialsToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.userCredentialsNotFoundError);
                }

                await userCredentials.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: userCredentialsToUpdate.map((u) => u.id) }
                    }
                );

                return await userCredentials.scope(scope).findAll({
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

module.exports = userCredentialsService;
