const {
    processControllerError,
    responseObj,
    requireReqAuth,
} = require("../../utils");


const {
    usersManagementService,
    userInfoService,
    companiesService,
    userSettingsService,
    userPreferencesService,
} = require("../../services");


const userApis = {
    get: {
        /**
         * @swagger
         *
         * /user:
         *   get:
         *     tags:
         *       - User Controller
         *     summary: Get all information for userId from JWT token
         *     description: Get all information for userId from JWT token
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Success - List of users
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Not Found user with given ID
         *       500:
         *         description: Internal Server Error
         */
        async getUser(req, res, next) {
            try {
                const userId = requireReqAuth(req, next);

                const user = await usersManagementService.getUserWithAllInfo(userId);

                return res.send(responseObj(user, "success"));
            } catch (error) {
                processControllerError(res, error);
            }
        },

        /**
         * @swagger
         *
         * /user/settings:
         *   get:
         *     tags:
         *       - User Controller
         *     summary: Get user's settings
         *     description: Get user's settings
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Success - List of users
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Not Found user settings with given ID
         *       500:
         *         description: Internal Server Error
         */
        async getSettings(req, res, next) {
            try {
                const userId = requireReqAuth(req, next);

                const settings = await userSettingsService.getUserSettings(
                    userId,
                );

                return res.send(responseObj(settings, "success"));
            } catch (error) {
                processControllerError(res, error);
            }
        },

        /**
         * @swagger
         *
         * /user/personal:
         *   get:
         *     tags:
         *       - User Controller
         *     summary: Get user's personal info
         *     description: Get user's personal info
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Success - List of users
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Not Found user info with given ID
         *       500:
         *         description: Internal Server Error
         */
        async getUserInfo(req, res, next) {
            try {
                const userId = requireReqAuth(req, next);

                const personalInfo = await userInfoService.getUserInfo(userId);

                return res.send(responseObj(personalInfo, "success"));
            } catch (error) {
                processControllerError(res, error);
            }
        },

        /**
         * @swagger
         *
         * /company:
         *   get:
         *     tags:
         *       - User Controller
         *     summary: Get user's company info
         *     description: Get user's company info
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Success - List of users
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Not Found user company info with given ID
         *       500:
         *         description: Internal Server Error
         */
        async getCompanyInfo(req, res, next) {
            try {
                const userId = requireReqAuth(req, next);

                const companyInfo = await companiesService.getUserCompanyInfo(
                    userId,
                );

                return res.send(responseObj(companyInfo, "success"));
            } catch (error) {
                processControllerError(res, error);
            }
        },

        /**
         * @swagger
         *
         * /user/recheck:
         *   get:
         *     tags:
         *       - User Controller
         *     summary: Get ReCheck token for second factor authentication
         *     description: Get ReCheck token for second factor authentication
         *     responses:
         *       200:
         *         description: Success - ReCheck token
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Not Found user with given ID
         *       500:
         *         description: Internal Server Error
         */
        async getRecheck(req, res, next) {
            try {
                const args = requireReqAuth(req, next, false, true, false);

                const recheckToken = await usersManagementService.getRecheckToken(args);

                return res.send(responseObj({recheckToken}, "success"));
            } catch (error) {
                processControllerError(res, error);
            }
        },
    },
    post: {
        /**
         * @swagger
         *
         * /user:
         *   post:
         *     tags:
         *       - User Controller
         *     summary: Register to the application
         *     description: Register to the application
         *     requestBody:
         *       $ref: '#/components/requestBodies/RegisterCredentials'
         *     responses:
         *       200:
         *         description: Success - List of users
         *       409:
         *         description: User has conflicted data
         *       500:
         *         description: Internal Server Error
         */
        async register(req, res, next) {
            try {
                const args = requireReqAuth(req, next, true, false, false);

                await usersManagementService.registerUser(args);

                return res.send(responseObj(null, "success"));
            } catch (error) {
                processControllerError(res, error);
            }
        }, // TODO put?

        /**
         * @swagger
         *
         * /login:
         *   post:
         *     tags:
         *       - User Controller
         *     summary: Login to the application
         *     description: Login to the application
         *     requestBody:
         *       $ref: '#/components/requestBodies/LoginCredentials'
         *     responses:
         *       200:
         *         description: Success - login token and keys selection hash
         *         $ref: '#/components/responses/LoginResponse'
         *       403:
         *         description: Incorrect data (username or password)
         *       500:
         *         description: Internal Server Error
         */
        async login(req, res, next) {
            try {
                const args = requireReqAuth(req, next, true, false, false);

                const tokenAndKeysDataIdObj = await usersManagementService.loginUser(args);

                return res.send(responseObj(tokenAndKeysDataIdObj, "success"));
            } catch (error) {
                processControllerError(res, error);
            }
        },
    },
    put: {
        /**
         * @swagger
         *
         * /user/finalize:
         *   put:
         *     tags:
         *       - User Controller
         *     summary: User finalize account registration
         *     description: User finalize account registration
         *     requestBody:
         *       $ref: '#/components/requestBodies/verifyUserEmailAndPutRecheckInfo'
         *     responses:
         *       200:
         *         description: Success
         *       404:
         *         description: Can not find user - incorrect userId or token
         *       409:
         *         description: User conflict (User already finished registration)
         *       500:
         *         description: Internal Server Error
         */
        async verifyUserEmailAndPutRecheckInfo(req, res, next) {
            try {
                const args = requireReqAuth(req, next, true, false, false);

                await usersManagementService.verifyUserEmailAndPutRecheckInfo(args);

                return res.send(
                    responseObj(
                        null,
                        "success",
                        "Account verified successfully!",
                    ),
                );
            } catch (error) {
                processControllerError(res, error);
            }
        },

        /**
         * @swagger
         *
         * /user/settings:
         *   put:
         *     tags:
         *       - User Controller
         *     summary: Edit user's settings
         *     description: Edit user's settings
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       $ref: '#/components/requestBodies/EditSettings'
         *     responses:
         *       200:
         *         description: Success - List of users
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Can not find settings with given ID
         *       500:
         *         description: Internal Server Error
         */
        async updateSettings(req, res, next) {
            try {
                const obj = requireReqAuth(req, next, true);

                const settings = await userSettingsService.updateUserSettings(
                    obj,
                    req.userId,
                );

                return res.send(
                    responseObj(
                        settings,
                        "success",
                        "Settings were updated successfully!",
                    ),
                );
            } catch (error) {
                processControllerError(res, error);
            }
        },

        /**
         * @swagger
         *
         * /user/personal:
         *   put:
         *     tags:
         *       - User Controller
         *     summary: Edit user's personal information
         *     description: Edit user's personal information
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       $ref: '#/components/requestBodies/EditPersonalInfo'
         *     responses:
         *       200:
         *         description: Success
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Can not find personal info with given ID
         *       500:
         *         description: Internal Server Error
         */
        async updateUserInfo(req, res, next) {
            try {
                const args = requireReqAuth(req, next, true);

                await userInfoService.updateUserPersonalInfo(args, req.userId);

                return res.send(
                    responseObj(
                        null,
                        "success",
                        "Personal Info was updated successfully!",
                    ),
                );
            } catch (error) {
                processControllerError(res, error);
            }
        },

        /**
         * @swagger
         *
         * /company:
         *   put:
         *     tags:
         *       - User Controller
         *     summary: Edit user's company information
         *     description: Edit user's company information
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       $ref: '#/components/requestBodies/EditCompanyInfo'
         *     responses:
         *       200:
         *         description: Success
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Can not find company info with given ID
         *       500:
         *         description: Internal Server Error
         */
        async updateCompanyInfo(req, res, next) {
            try {
                const args = requireReqAuth(req, next, true);

                await companiesService.updateUserCompanyInfo(args, req.userId);

                return res.send(
                    responseObj(
                        null,
                        "success",
                        "Company Info was updated successfully!",
                    ),
                );
            } catch (error) {
                processControllerError(res, error);
            }
        },

        /**
         * @swagger
         *
         * /user/preferences:
         *   put:
         *     tags:
         *       - User Controller
         *     summary: Edit user's preferences
         *     description: Edit user's preferences
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       $ref: '#/components/requestBodies/EditPreferences'
         *     responses:
         *       200:
         *         description: Success - Preferences
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Can not find preferences with given ID
         *       500:
         *         description: Internal Server Error
         */
        async updateUserPreferences(req, res, next) {
            try {
                const obj = requireReqAuth(req, next, true);
                const preferences = await userPreferencesService.updateUserPreferences(
                    obj,
                    req.userId,
                );

                return res.send(
                    responseObj(
                        preferences,
                        "success",
                        "Preferences were updated successfully!",
                    ),
                );
            } catch (error) {
                processControllerError(res, error);
            }
        },

        /**
         * @swagger
         *
         * /user/recheck:
         *   put:
         *     tags:
         *       - User Controller
         *     summary: Update ReCheck second factor authentication
         *     description: Update ReCheck second factor authentication
         *     requestBody:
         *       $ref: '#/components/requestBodies/updateRecheck'
         *     responses:
         *       200:
         *         description: Success
         *       401:
         *         description: Unauthorized
         *       404:
         *         description: Can not find user with return challenge
         *       500:
         *         description: Internal Server Error
         */
        async updateRecheck(req, res, next) {
            try {
                const obj = requireReqAuth(req, next, true, false, false);
                await usersManagementService.updateRecheckInfo(obj);

                return res.send(
                    responseObj(
                        null,
                        "success",
                        "ReCheck token was updated successfully!",
                    ),
                );
            } catch (error) {
                processControllerError(res, error);
            }
        },

        /**
         * @swagger
         *
         * /user:
         *   put:
         *     tags:
         *       - User Controller
         *     summary: Edit user's credentials
         *     description: Edit user's credentials
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       $ref: '#/components/requestBodies/EditUserCredentials'
         *     responses:
         *       200:
         *         description: Success
         *       401:
         *         description: Unauthorized
         *       500:
         *         description: Internal Server Error
         */
        async updateCredentials(req, res, next) {
            try {
                const args = requireReqAuth(req, next, true);

                await usersManagementService.updateUser(args, req.userId);

                return res.send(
                    responseObj(
                        null,
                        "success",
                        "User credentials were updated successfully!",
                    ),
                );
            } catch (error) {
                processControllerError(res, error);
            }
        },
    },
};


/**
 * @swagger
 *
 * tags:
 *   - name: User Controller
 *     description: API endpoints for user account management
 */
module.exports = userApis;
