const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "billing",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER(11).UNSIGNED
            },
            userChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            productsId: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED // foreign key
            },
            tokenCost100: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            dataId: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED, // foreign key
                defaultValue: 0,
                validate: {
                    min: 0,
                    atLeastOneNotNull(value) {
                        if (
                            (parseInt(value) > 0 &&
                                (parseInt(this.sharesId) > 0 ||
                                    parseInt(this.signaturesId) > 0 ||
                                    parseInt(this.billingId) > 0)) ||
                            (parseInt(value) === 0 &&
                                parseInt(this.sharesId) === 0 &&
                                parseInt(this.signaturesId) === 0 &&
                                parseInt(this.billingId) === 0)
                        ) {
                            throw new Error("There should be at least one not null value");
                        }
                    }
                }
            },
            sharesId: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED, // foreign key
                defaultValue: 0,
                validate: {
                    min: 0,
                    atLeastOneNotNull(value) {
                        if (
                            (parseInt(value) > 0 &&
                                (parseInt(this.dataId) > 0 ||
                                    parseInt(this.signaturesId) > 0 ||
                                    parseInt(this.billingId) > 0)) ||
                            (parseInt(value) === 0 &&
                                parseInt(this.dataId) === 0 &&
                                parseInt(this.signaturesId) === 0 &&
                                parseInt(this.billingId) === 0)
                        ) {
                            throw new Error("There should be at least one not null value");
                        }
                    }
                }
            },
            signaturesId: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED, // foreign key
                defaultValue: 0,
                validate: {
                    min: 0,
                    atLeastOneNotNull(value) {
                        if (
                            (parseInt(value) > 0 &&
                                (parseInt(this.dataId) > 0 ||
                                    parseInt(this.sharesId) > 0 ||
                                    parseInt(this.billingId) > 0)) ||
                            (parseInt(value) === 0 &&
                                parseInt(this.dataId) === 0 &&
                                parseInt(this.sharesId) === 0 &&
                                parseInt(this.billingId) === 0)
                        ) {
                            throw new Error("There should be at least one not null value");
                        }
                    }
                }
            },
            billingId: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED, // foreign key
                defaultValue: 0,
                validate: {
                    min: 0,
                    atLeastOneNotNull(value) {
                        if (
                            (parseInt(value) > 0 &&
                                (parseInt(this.dataId) > 0 ||
                                    parseInt(this.sharesId) > 0 ||
                                    parseInt(this.signaturesId) > 0)) ||
                            (parseInt(value) === 0 &&
                                parseInt(this.dataId) === 0 &&
                                parseInt(this.sharesId) === 0 &&
                                parseInt(this.signaturesId) === 0)
                        ) {
                            throw new Error("There should be at least one not null value");
                        }
                    }
                }
            },
            trailHash: {
                type: DataTypes.STRING(100), // validation hash
                defaultValue: null
            },
            network: {
                // 0-none; 1-eth; 2-ae;
                allowNull: false,
                type: DataTypes.TINYINT.UNSIGNED
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },
        {
            indexes: [
                {
                    name: "billing_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                },
                {
                    name: "billing_productsId_index",
                    using: "BTREE",
                    fields: ["productsId"]
                },
                {
                    name: "billing_tokenCost100_index",
                    using: "BTREE",
                    fields: ["tokenCost100"]
                },
                {
                    name: "billing_dataId_index",
                    using: "BTREE",
                    fields: ["dataId"]
                },
                {
                    name: "billing_sharesId_index",
                    using: "BTREE",
                    fields: ["sharesId"]
                },
                {
                    name: "billing_signaturesId_index",
                    using: "BTREE",
                    fields: ["signaturesId"]
                },
                {
                    name: "billing_billingId_index",
                    using: "BTREE",
                    fields: ["billingId"]
                },
                {
                    name: "billing_trailHash_index",
                    using: "BTREE",
                    fields: ["trailHash"]
                },
                {
                    name: "billing_network_index",
                    using: "BTREE",
                    fields: ["network"]
                }
            ]
        }
    );
};
