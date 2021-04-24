const { processControllerError, responseObj, requireReqAuth } = require("../../utils");

const { usersService } = require("../../services");

const userApis = {
    post: {
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

                const tokenAndKeysDataIdObj = await usersService.loginUser(args);

                return res.send(responseObj(tokenAndKeysDataIdObj, "success"));
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
 *   - name: User Controller
 *     description: API endpoints for user account management
 */
module.exports = userApis;
