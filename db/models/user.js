const {DataTypes} = require("sequelize");
const bcrypt = require("bcrypt");

async function hashPassword(user) {
    if (!user.changed("password")) return null;

    const password = user.password || user.attributes.password;
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
}

module.exports = (sequelize) => {
    const User = sequelize.define(
        "users",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            username: {
                allowNull: false,
                type: DataTypes.STRING(25),
                validate: {
                    is: {
                        args: /^[A-Za-z0-9_]{3,25}$/,
                        msg: "Username should be 3-25 latin characters long.",
                    },
                },
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    is: {
                        args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                        msg: "Password should contain latin uppercase, lowercase, digit and should be at least 8 characters long.",
                    },
                },
            },
            isActive: {
                allowNull: false,
                default: false,
                type: DataTypes.BOOLEAN,
                validate: {
                    isIn: {
                        args: [[true, false]],
                        msg: "Invalid activation flag.",
                    },
                },
            },
            loginAttempts: {
                allowNull: true,
                default: 0,
                type: DataTypes.INTEGER,
            },
            accountBlockExp: {
                allowNull: true,
                default: null,
                type: DataTypes.DATE,
                validate: {
                    isDate: {
                        args: true,
                        msg: "Account Block Expiration is not date.",
                    },
                },
            },
            passResetToken: {
                unique: true,
                allowNull: true,
                default: null,
                type: DataTypes.UUID,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "Password reset token is not uuid.",
                    },
                },
            },
            passResetTokenExpiration: {
                allowNull: true,
                default: null,
                type: DataTypes.DATE,
                validate: {
                    isDate: {
                        args: true,
                        msg: "Password reset token expiration is not date.",
                    },
                },
            },
            emailVerifyToken: {
                unique: true,
                allowNull: true,
                default: null,
                type: DataTypes.UUID,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "Email verify token is not uuid.",
                    },
                },
            },
            emailVerifyTokenExpiration: {
                allowNull: true,
                default: null,
                type: DataTypes.DATE,
                validate: {
                    isDate: {
                        args: true,
                        msg: "Email verify token expiration is not date.",
                    },
                },
            },
            emailVerifiedAt: {
                allowNull: true,
                default: null,
                type: DataTypes.DATE,
                validate: {
                    isDate: {
                        args: true,
                        msg: "Email verify time is not date.",
                    },
                },
            },
            recheckId: {
                unique: true,
                allowNull: true,
                default: null,
                type: DataTypes.STRING(100),
                validate: {
                    is: {
                        args: /re_[0-9a-zA-Z]{41,100}/,
                        msg: "Not a valid ReCheck id.",
                    },
                },
            },
            pubEncrKey: {
                unique: true,
                allowNull: true,
                default: null,
                type: DataTypes.STRING(100),
                validate: {
                    is: {
                        args: /[0-9a-zA-Z]{32,100}/, // TODO is there fixed limits?
                        msg: "Not a valid public encryption key.",
                    },
                },
            },
            recheckToken: {
                unique: true,
                allowNull: true,
                default: null,
                type: DataTypes.UUID,
                validate: {
                    isUUID: {
                        args: [], // with 1 or 4 throws errors, [] validates length maybe more
                        msg: "Not a valid ReCheck token.",
                    },
                },
            },
            returnChallenge: {
                unique: true,
                allowNull: true,
                default: null,
                type: DataTypes.STRING(100),
                validate: {
                    is: {
                        args: /0x[0-9a-f]{64}/,
                        msg: "Not a valid return challenge.",
                    },
                },
            },
            keysDataId: {
                unique: true,
                allowNull: true,
                default: null,
                type: DataTypes.STRING(100),
                validate: {
                    is: {
                        args: /0x[0-9a-f]{64}/,
                        msg: "Keys data id is not valid.",
                    },
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn("NOW"),
            },
        },
        {
            hooks: {
                beforeSave: async (user) => hashPassword(user),
                beforeUpdate: async (user) => hashPassword(user),
            },
            defaultScope: {
                attributes: {
                    exclude: [
                        "loginAttempts",
                        "accountBlockExp",
                        "password",
                        "passResetToken",
                        "passResetTokenExpiration",
                        "emailVerifyToken",
                        "emailVerifyTokenExpiration",
                        "emailVerifiedAt",
                        "pubEncrKey",
                        "recheckToken",
                        "returnChallenge",
                        "keysDataId",
                    ],
                },
            },
            scopes: {
                default: {
                    attributes: {
                        exclude: [
                            "loginAttempts",
                            "accountBlockExp",
                            "password",
                            "passResetToken",
                            "passResetTokenExpiration",
                            "emailVerifyToken",
                            "emailVerifyTokenExpiration",
                            "emailVerifiedAt",
                            "pubEncrKey",
                            "recheckToken",
                            "returnChallenge",
                            "keysDataId",
                        ],
                    },
                },
                withPassword: {
                    attributes: {
                        exclude: [
                            "passResetToken",
                            "passResetTokenExpiration",
                            "emailVerifyToken",
                            "emailVerifyTokenExpiration",
                            "emailVerifiedAt",
                        ],
                    },
                },
                allFields: {
                    attributes: {},
                },
            },
            freezeTableName: true,
            timestamps: true,
        },
    );

    User.prototype.validatePassword = function (password) {
        return bcrypt.compare(password, this.password);
    };

    return User;
};
