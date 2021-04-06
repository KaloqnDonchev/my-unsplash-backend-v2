module.exports = {
    up: async (queryInterface, Sequelize) => {
        let currencyRates = await require("./seeds").currencyRates();
        await queryInterface.sequelize.query(`ALTER SEQUENCE "currencyRates_id_seq" RESTART WITH ${currencyRates.length + 1}`);

        if (currencyRates.length <= 0) {
            return Promise.resolve();
        }

        return queryInterface.bulkInsert("currencyRates", currencyRates);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("currencyRates", null, {});
    },
};
