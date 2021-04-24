const { isNullAny } = require("../../utils");
const { users } = require("../../db/seeders/seeds");

module.exports = {
    nonVerifiedUser: async () => (await users()).find((r) => !isNullAny(r.emailVerifyToken)),
    verifiedUserWithInfo: async () => {
        const user = (await users()).find((r) => isNullAny(r.emailVerifyToken));
        if (isNullAny(user)) {
            return null;
        }

        const services = require("./index");

        const userInfo = await services.userInfo.infoForUserWithId(user.id);
        if (isNullAny(userInfo)) {
            return null;
        }

        const userAddress = await services.addresses.addressWithId(userInfo.addressId);
        if (isNullAny(userAddress)) {
            return null;
        }

        const userCompany = await services.companies.companyWithId(userInfo.companyId);
        if (isNullAny(userCompany)) {
            return null;
        }

        const companyAddress = await services.addresses.addressWithId(userCompany.addressId);
        if (isNullAny(companyAddress)) {
            return null;
        }

        const userSettings = await services.userSettings.settingsForUserWithId(user.id);
        if (isNullAny(userSettings)) {
            return null;
        }

        const userPreferences = await services.userPreferences.preferencesForUserWithId(user.id);
        if (isNullAny(userPreferences)) {
            return null;
        }

        const userAvatar = await services.userAvatars.avatarForUserWithId(user.id);

        return {
            ...user,
            info: {
                ...userInfo,
                address: userAddress,
                company: {
                    ...userCompany,
                    address: companyAddress
                }
            },
            settings: userSettings,
            preferences: userPreferences,
            avatar: userAvatar
        };
    },
    verifiedUser: async () => (await users()).find((r) => isNullAny(r.emailVerifyToken))
};
