;
const crypto = require("crypto");
const fs = require("fs");

const {JWTKeysDir} = require("./config.js").server.JWT;


const {publicKey, privateKey} = crypto.generateKeyPairSync("rsa", {modulusLength: 1024})

let pubKey = publicKey.export({type: "pkcs1", format: "pem"});

let secretKey = privateKey.export({type: "pkcs1", format: "pem"});

if (!fs.existsSync(JWTKeysDir)) {
    fs.mkdirSync(JWTKeysDir);
}

if (!fs.existsSync(`${JWTKeysDir}/public.key`) || !fs.existsSync(`${JWTKeysDir}/private.key`)) {
    fs.writeFileSync(`${JWTKeysDir}/private.key`, secretKey);
    fs.writeFileSync(`${JWTKeysDir}/public.key`, pubKey);
}
