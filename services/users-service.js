const { isNullAny, logIfNecessary } = require("../utils");
const { users } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const UsersService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await users.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await users.scope(scope).findOne({
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
                return await users.scope(scope).findAll({
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
                const userToUpdate = await users.findOne({
                    where: whereObj
                });

                if (isNullAny(userToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.userNotFoundError);
                }

                await users.update(
                    {
                        ...userToUpdate,
                        ...obj
                    },
                    {
                        where: { id: userToUpdate.id }
                    }
                );

                return await users.scope(scope).findOne({
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
                const usersToUpdate = await users.findAll({
                    where: whereObj
                });

                if (isNullAny(usersToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.userNotFoundError);
                }

                await users.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: usersToUpdate.map((u) => u.id) }
                    }
                );

                return await users.scope(scope).findAll({
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

UsersService.getUserLanguage = async (userId) => {
    try {
        const user = await UsersService.find.one({ userId });
        return user.language;
    } catch (error) {
        logIfNecessary(error);
        throw error;
    }
};

module.exports = UsersService;
