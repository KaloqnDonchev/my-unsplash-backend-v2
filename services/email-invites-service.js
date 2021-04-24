const { isNullAny, logIfNecessary } = require("../utils");
const { emailInvites } = require("../db").getDBModels();
const { logger } = require("../logger");
const { ServiceError, errorMessages } = require("../errors");
const { defaultScope } = require("../utils").constants;

const emailInvitesService = {
    create: {
        single: async (obj, options = {}) => {
            try {
                return await emailInvites.create(obj, options);
            } catch (error) {
                logIfNecessary(error, true);
                throw error;
            }
        }
    },
    find: {
        one: async (whereObj, scope = defaultScope, options = {}) => {
            try {
                return await emailInvites.scope(scope).findOne({
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
                return await emailInvites.scope(scope).findAll({
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
                const emailInviteToUpdate = await emailInvites.findOne({
                    where: whereObj
                });

                if (isNullAny(emailInviteToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.emailInvitesNotFoundError);
                }

                await emailInvites.update(
                    {
                        ...emailInviteToUpdate,
                        ...obj
                    },
                    {
                        where: { id: emailInviteToUpdate.id }
                    }
                );

                return await emailInvites.scope(scope).findOne({
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
                const emailInvitesToUpdate = await emailInvites.findAll({
                    where: whereObj
                });

                if (isNullAny(emailInvitesToUpdate)) {
                    logger.warn(whereObj);
                    throw new ServiceError(errorMessages.emailInvitesNotFoundError);
                }

                await emailInvites.update(
                    {
                        ...obj
                    },
                    {
                        where: { id: emailInvitesToUpdate.map((u) => u.id) }
                    }
                );

                return await emailInvites.scope(scope).findAll({
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

module.exports = emailInvitesService;
