;
const {isNullAny} = require("../../utils");
const {users} = require("../../db/seeders/seeds");


module.exports = {
    nonVerifiedUser: async () => {
        return (await users()).find(r => !isNullAny(r.emailVerifyToken));
    },
    verifiedUserWithInfo: async () => {
        let user = (await users()).find(r => isNullAny(r.emailVerifyToken));
        if (isNullAny(user)) {
            return null;
        }

        const services = require("./index");

        let userInfo = await services.userInfo.infoForUserWithId(user.id);
        if (isNullAny(userInfo)) {
            return null;
        }

        let userAddress = await services.addresses.addressWithId(userInfo.addressId);
        if (isNullAny(userAddress)) {
            return null;
        }

        let userCompany = await services.companies.companyWithId(userInfo.companyId);
        if (isNullAny(userCompany)) {
            return null;
        }

        let companyAddress = await services.addresses.addressWithId(userCompany.addressId);
        if (isNullAny(companyAddress)) {
            return null;
        }

        let userSettings = await services.userSettings.settingsForUserWithId(user.id);
        if (isNullAny(userSettings)) {
            return null;
        }

        let userPreferences = await services.userPreferences.preferencesForUserWithId(user.id);
        if (isNullAny(userPreferences)) {
            return null;
        }

        let userAvatar = await services.userAvatars.avatarForUserWithId(user.id);


        return {
            ...user,
            info: {
                ...userInfo,
                address: userAddress,
                company: {
                    ...userCompany,
                    address: companyAddress,
                },
            },
            settings: userSettings,
            preferences: userPreferences,
            avatar: userAvatar,
        };
    },
    verifiedUser: async () => {
        return (await users()).find(r => isNullAny(r.emailVerifyToken));
    },
}