module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            isActive: {
                allowNull: true,
                type: Sequelize.BOOLEAN,
            },
            passResetToken: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            passResetTokenExpiration: {
                allowNull: false,
                type: Sequelize.DATE,
                unique: true,
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable("users");
    },
};
