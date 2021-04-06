const {sign, verify, decode} = require("jsonwebtoken");
const fs = require("fs");

const config = require("../config");

const privateKey = fs.readFileSync(`${config.JWTKeysDir}/private.key`, "utf8");
const publicKey = fs.readFileSync(`${config.JWTKeysDir}/public.key`, "utf8");

// SIGNING OPTIONS
const options = config.JWTOptions;

const jwt = {
    sign: (payload) => {
        // Token signing options
        const signOptions = {
            ...options,
            expiresIn: "1h", // 1 hour validity
        };

        return sign({payload}, privateKey, signOptions);
    },
    verify: (token, cb) => {
        const verifyOptions = {
            ...options,
            expiresIn: "1h",
            algorithm: ["RS256"],
        };

        try {
            return verify(token, publicKey, verifyOptions, cb);
        } catch (err) {
            return false;
        }
    },
    // returns null if token is invalid
    decode: (token) => decode(token, {complete: true}),
};

function checkAuth(req, res, next) {
    const authHeader = req.headers[config.authHeaderName];

    if (authHeader) {
        // TODO check if split has [1]
        const token = authHeader.split(" ")[1];

        jwt.verify(token, (err, result) => {
            if (err) {
                console.log(err);
                return next({name: "UnauthorizedError"});
            }

            req.userId = result.payload;
            next();
        });
    } else {
        return next({name: "UnauthorizedError"});
    }
}

module.exports = {
    jwt,
    checkAuth,
};
