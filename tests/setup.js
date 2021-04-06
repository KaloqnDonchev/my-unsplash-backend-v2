require("../key-generator.js");//create pub private keys for jwt if not existent

const {exec} = require("child_process");
const db = require("../db");
const dbConfig = require("../db/config.js");


before(function (done) {
    this.timeout(300000);

    new Promise((resolve) => {
        db.startDBConnection().then(() => resolve());
    }).then(() => done());
});

after(function (done) {
    this.timeout(300000);

    new Promise((resolve) => {
        db.stopDBConnection().then(() => resolve());
    }).then(() => done());
});

beforeEach(function (done) {
    this.timeout(100000);

    new Promise((resolve) => {
        if (dbConfig.shouldForceDBSync && dbConfig.shouldSeedDemoData) {
            exec("npx sequelize-cli db:seed:undo:all --env test --debug", () => {
                exec("npx sequelize-cli db:seed:all --env test --debug", () => {
                    resolve();
                });
            });
        }
    }).then(() => done());
});
