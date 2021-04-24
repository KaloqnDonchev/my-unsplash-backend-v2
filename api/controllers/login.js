const { processControllerError, responseObj, requireReqAuth } = require("../../utils");

const { RtnTokenCbService, UsersService } = require("../../services");

const loginApis = {
    get: {
        /**
         * @swagger
         *
         * /login/challenge:
         *   get:
         *     tags:
         *       - Login Controller
         *     summary: Get login challenge
         *     description: Get login challenge
         *     responses:
         *       200:
         *         description: Success - login challenge
         *       500:
         *         description: Internal Server Error
         */
        async getLoginChallenge(req, res, next) {
            try {
                const challenge = await RtnTokenCbService.createLoginChallenge();

                return res.send(responseObj(challenge, "success"));
            } catch (error) {
                await processControllerError(req, res, error);
            }
        },
        /**
         * @swagger
         *
         * /login/challenge/{returnChallenge}/{returnUrl}:
         *   get:
         *     tags:
         *       - Login Controller
         *     summary: Get login challenge for return challenge
         *     description: Get login challenge for return challenge
         *     parameters:
         *       - in: path
         *         name: returnChallenge
         *         required: true
         *       - in: path
         *         name: returnUrl
         *         required: true
         *     responses:
         *       200:
         *         description: Success - login challenge
         *       500:
         *         description: Internal Server Error
         */
        async getLoginChallengeForReturnChallenge(req, res, next) {
            try {
                const params = requireReqAuth(req, next, false, true, false);

                const challenge = await RtnTokenCbService.createLoginChallenge(
                    params.returnChallenge,
                    params.returnUrl
                );

                return res.send(responseObj(challenge, "success"));
            } catch (error) {
                await processControllerError(req, res, error);
            }
        }
    },
    post: {
        /**
         * @swagger
         *
         * /login/mobile:
         *   post:
         *     tags:
         *       - Login Controller
         *     summary: Login to mobile device
         *     description: Login to mobile device
         *     responses:
         *       200:
         *         description: Success - mobile login
         *       500:
         *         description: Internal Server Error
         */
        async postMobileLogin(req, res, next) {
            try {
                const body = requireReqAuth(req, next, true);
                const resultObj = await UsersService.createMobileLogin(body);

                return res.send(responseObj(resultObj, "success"));
            } catch (error) {
                await processControllerError(req, res, error);
            }
        }
    }
};

/**
 * @swagger
 *
 * tags:
 *   - name: Login Controller
 *     description: API endpoints for login management
 */
module.exports = loginApis;
