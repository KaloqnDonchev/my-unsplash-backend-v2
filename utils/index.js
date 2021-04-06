const {ValidationError: sequelizeError} = require("sequelize");
const {keccak256} = require("js-sha3");
const {jwt} = require("./jwt");
const {logger} = require("../logger");
const {xChainError} = require("../errors");

function processControllerError(res, error) {
    logIfNecessary(error);

    if (error instanceof sequelizeError) {
        return res.status(422).send(processValidationError(error));
    }

    if (!isNullAny(error.code)) {
        return res.status(error.code).json(error);
    }

    return res.send(responseObj(null, "error", error.message));
}

function processValidationError(err) {
    if (err instanceof sequelizeError && !isNullAny(err.errors)) {
        if (err.errors.length > 1) {
            const arr = [];
            for (let i = 0; i < err.errors.length; i++) {
                arr.push({
                    field: err.errors[i].path,
                    message: err.errors[i].message,
                });
            }
            return arr;
        }

        return {
            field: err.errors[0].path,
            message: err.errors[0].message,
        };
    }

    return responseObj(err, "error", "Something went wrong!");
}

function logIfNecessary(error, shouldLog = false) {
    if (shouldLog || (!(error instanceof sequelizeError) && !(error instanceof xChainError))) {
        logger.error(error);
    }
}

function responseObj(data = {}, status = "success", message = "") {
    return {status, message, data};
}

function requireReqAuth(
    req,
    next,
    isBodyRequired = false,
    areParamsRequired = false,
    shouldHaveUserId = true,
) {
    if (isNullAny(req.userId) && shouldHaveUserId) {
        return next({name: "UnauthorizedError"});
    }

    if (isBodyRequired) {
        if (isNullAny(req.body)) {
            throw new Error("Invalid body param!");
        }

        return req.body;
    }

    if (areParamsRequired) {
        if (isNullAny(req.params)) {
            throw new Error("Invalid body param!");
        }

        return req.params;
    }

    return req.userId;
}

function isNullAny(...args) {
    for (let i = 0; i < args.length; i++) {
        const current = args[i];

        if (
            current == null || // element == null covers element === undefined
            (current.hasOwnProperty("length") && current.length === 0) || // has length and it's zero
            (current.constructor === Object && Object.keys(current).length === 0) || // is an Object and has no keys
            current.toString().toLowerCase() === "null" ||
            current.toString().toLowerCase() === "undefined" ||
            current.toString().trim() === ""
        ) {
            return true;
        }

        if (typeof current !== "number") {
            try {
                if (+new Date(current) === 0) {
                    // is not a number and can be parsed as null date 1970
                    return true;
                }
            } catch (ignored) {
            }
        }

        try {
            const parsed = JSON.parse(current);
            if (parsed !== current && isNullAny(parsed)) {
                // recursive check for stringified object
                return true;
            }
        } catch (ignored) {
        }

        // check for hashes of null values
        if (
            [
                "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470", // null/undefined/""/[].toString(),
                "0x7bc087f4ef9d0dc15fef823bff9c78cc5cca8be0a85234afcfd807f412f40877", // {}.toString()
                "0x518674ab2b227e5f11e9084f615d57663cde47bce1ba168b4c19c7ee22a73d70", // JSON.stringify([])
                "0xb48d38f93eaa084033fc5970bf96e559c33c4cdc07d889ab00b4d63f9590739d", // JSON.stringify({})
                "0xefbde2c3aee204a69b7696d4b10ff31137fe78e3946306284f806e2dfc68b805", // "null"
                "0x019726c6babc1de231f26fd6cbb2df2c912784a2e1ba55295496269a6d3ff651", // "undefined"
                "0x681afa780d17da29203322b473d3f210a7d621259a4e6ce9e403f5a266ff719a", // " "
                "0xfc6664300e2ce056cb146b05edef3501ff8bd027c49a8dde866901679a24fb7e", // new Date(0).toString()
                "0x0000000000000000000000000000000000000000000000000000000000000000",
            ].includes(current)
        ) {
            return true;
        }

        // TODO if array check if some element is not null
    }

    return false;
}

// function isNullNestedProperty(object, nestedPropPath) {
//     return isNullAny(getPropValue(object, nestedPropPath));
//
//     function getPropValue(object, path) {
//         return path.split('.').reduce((obj, key) => obj == null ? obj : obj[key], object);
//     }
// }

function areNotNullAll(...args) {
    return args.some((arg) => !isNullAny(arg));
}

function areNullAll(...args) {
    return !areNotNullAll(...args);
}

function destroyFailedSequelize(instances) {
    instances.map((instance) => (!isNullAny(instance) ? instance.destroy() : null));
}

function filterObjectOrArrayObjsProps(objOrArrayObj, keys, shouldClone = true) {
    if (shouldClone) {
        objOrArrayObj = JSON.parse(JSON.stringify(objOrArrayObj));
    }

    let isArray = Array.isArray(objOrArrayObj);
    if (!isArray) {
        objOrArrayObj = [objOrArrayObj];
    }

    if (!Array.isArray(keys)) {
        keys = [keys];
    }

    keys.forEach(key => {
        objOrArrayObj.map(obj => {
            if (!isNullAny(obj) && typeof obj === "object") {
                for (const prop in obj) {
                    if (!obj.hasOwnProperty(prop)) continue;
                    if (prop === key) {
                        delete obj[key];
                    } else if (typeof obj[prop] === "object") {
                        filterObjectOrArrayObjsProps(obj[prop], key, false);
                    }
                }
            }
        });
    });

    if (!isArray) {
        return objOrArrayObj[0];
    }

    return objOrArrayObj;
}

function getHash(string) {
    return `0x${keccak256(string)}`;
}

function convertSequelizeData(data) {
    if (isNullAny(data)) {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map((e) => JSON.parse(JSON.stringify(e)));
    }

    return JSON.parse(JSON.stringify(data));
}

function getTimeMinuteBeforeNow() {
    const now = new Date();
    now.setMinutes(new Date().getMinutes() - 1);
    return now;
}


module.exports = {
    processControllerError,
    processValidationError,
    responseObj,
    requireReqAuth,
    destroyFailedSequelize,
    logIfNecessary,
    jwt,
    isNullAny,
    areNotNullAll,
    areNullAll,
    filterObjectOrArrayObjsProps,
    getHash,
    convertSequelizeData,
    getTimeMinuteBeforeNow,
};
