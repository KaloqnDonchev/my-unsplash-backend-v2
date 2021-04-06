const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUIExpress = require("swagger-ui-express");

const config = require("../../config.js");
const {
    userTitles,
    fundTypes,
    currencyTypes,
    organizationTypes,
    organizationStrategies,
    projectTypes,
} = require("../../db/validations.js");


const reusableDefinitions = {
    schemas: {
        Address: {
            type: "object",
            properties: {
                id: {
                    type: "integer",
                    primaryKey: true,
                },
                street: {type: "string"},
                city: {type: "string"},
                state: {type: "string"},
                country: {type: "string"},
                zipCode: {type: "string"},
                createdAt: {type: "date-time"},
                updatedAt: {type: "date-time"},
            },
        },
        Company: {
            type: "object",
            properties: {
                id: {
                    type: "integer",
                    primaryKey: true,
                },
                addressId: {type: "integer"},
                organizationName: {type: "string"},
                dateOfRegistration: {type: "date-time"},
                organizationType: {type: "enum"},
                strategy: {type: "enum"},
                createdAt: {type: "date-time"},
                updatedAt: {type: "date-time"},
                address: {
                    $ref: "#/components/schemas/Address",
                },
            },
        },
        Settings: {
            type: "object",
            properties: {
                id: {type: "integer", primaryKey: true},
                userId: {type: "integer"},
                createdAt: {type: "date-time"},
                updatedAt: {type: "date-time"},
            },
        },
        Avatar: {
            type: "object",
            properties: {
                id: {type: "integer", primaryKey: true},
                userId: {type: "integer"},
                createdAt: {type: "date-time"},
                updatedAt: {type: "date-time"},
            },
        },
        UserInfo: {
            type: "object",
            properties: {
                id: {type: "integer", primaryKey: true},
                userId: {type: "integer"},
                addressId: {type: "integer"},
                companyId: {type: "integer"},
                userType: {type: "enum"},
                title: {type: "enum"},
                firstName: {type: "string"},
                lastName: {type: "string"},
                dateOfBirth: {type: "date-time"},
                phone: {type: "string"},
                email: {type: "email"},
                jobPosition: {type: "string"},
                createdAt: {type: "date-time"},
                updatedAt: {type: "date-time"},
                address: {
                    $ref: "#/components/schemas/Address",
                },
                company: {
                    $ref: "#/components/schemas/Company",
                },
            },
        },
        Project: {
            type: "object",
            properties: {
                id: {type: "integer", primaryKey: true},
                userId: {type: "integer"},
                encrProjectMap: {type: "string"},
                srcPubEncrKey: {type: "string"},
                projectType: {type: "enum"},
                currency: {type: "enum"},
                companyName: {type: "uuid"},
                fundName: {type: "uuid"},
                fundType: {type: "enum"},
                projectName: {type: "string"},
                contactName: {type: "uuid"},
                contactPhone: {type: "uuid"},
                managerName: {type: "uuid"},
                contactEmail: {type: "uuid"},
                targetCommitment: {type: "float"},
                projectDeadline: {type: "uuid"},
                performanceScore: {type: "uuid"},
                portfolioScore: {type: "uuid"},
                priceScore: {type: "uuid"},
                projectionScore: {type: "uuid"},
                createdAt: {type: "date-time"},
                updatedAt: {type: "date-time"},
            },
        },
        User: {
            type: "object",
            properties: {
                id: {type: "integer"},
                username: {type: "string"},
                password: {type: "hash"},
                passResetToken: {type: "uuid"},
                passResetTokenExpiration: {type: "date-time"},
                emailVerifyToken: {type: "uuid"},
                emailVerifyTokenExpiration: {type: "date-time"},
                emailVerifiedAt: {type: "date-time"},
                accountBlockExp: {type: "date-time"},
                loginAttempts: {type: "integer"},
                isActive: {type: "boolean"},
                createdAt: {type: "date-time"},
                updatedAt: {type: "date-time"},
                info: {
                    $ref: "#/components/schemas/UserInfo",
                },
                avatar: {
                    $ref: "#/components/schemas/Avatar",
                },
                settings: {
                    $ref: "#/components/schemas/Settings",
                },
            },
        },
        Document: {
            type: "object",
            properties: {
                id: {type: "integer", primaryKey: true},
                userId: {type: "integer"},
                projectId: {type: "integer"},
                documentDataId: {type: "string", primaryKey: true},
                documentName: {type: "string"},
                documentExtension: {type: "string"},
                createdAt: {type: "date-time"},
                updatedAt: {type: "date-time"},
            },
        },
        Template: {
            type: "object",
            properties: {
                id: {type: "integer", primaryKey: true},
                userId: {type: "integer"},
                projectId: {type: "integer"},
                documentDataId: {type: "string"},
                templateData: {type: "string"},
                encrTemplateMap: {type: "string"},
                srcPubEncrKey: {type: "string"},
                templateFolder: {type: "string"},
                createdAt: {type: "date-time"},
                updatedAt: {type: "date-time"},
            },
        },
    },
    responses: {
        ErrorData: {
            type: "object",
            properties: {
                field: {type: "string"},
                message: {type: "string"},
            },
        },
        Unauthorized: {
            type: "object",
            properties: {
                status: {type: "Error"},
                message: {type: "Invalid token!"},
            },
        },
        ResponseObject: {
            type: "object",
            properties: {
                data: {type: "object" || "null"},
                status: {type: "enum"},
                message: {type: "string"},
            },
        },
        LoginResponse: {
            description: "Login response object.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            status: {type: "enum"},
                            message: {type: "string"},
                            data: {
                                type: "object",
                                properties: {
                                    token: {type: "string"},
                                },
                            },
                        },
                    },
                    example: {
                        status: "success",
                        message: "",
                        data: {
                            token: "token....",
                        },
                    },
                },
            },
        },
    },
    requestBodies: {
        LoginCredentials: {
            required: true,
            description: "JSON object with login credentials.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            username: {type: "string"},
                            password: {type: "string"},
                        },
                    },
                    example: {
                        username: "test",
                        password: "testPass1",
                    },
                },
            },
        },
        RegisterCredentials: {
            required: true,
            description: "JSON object with register credentials.",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/User",
                    },
                    example: {
                        firstName: "John",
                        lastName: "Doe",
                        title: "mr.",
                        dateOfBirth: "2020-10-31T22:00:00.000Z",
                        jobPosition: "CEO",
                        phone: "+359894244323",
                        email: "test@example.com",
                        street: "Studentska 8",
                        city: "Ruse",
                        zipCode: "7000",
                        state: "Ruse",
                        country: "Bulgaria",
                        avatar: null,
                        organizationName: "ReCheck B.V",
                        dateOfRegistration: "2020-10-31T22:00:00.000Z",
                        orgStreet: "Studentska 8",
                        orgCity: "Ruse",
                        orgState: "Ruse",
                        orgZipCode: "7000",
                        orgCountry: "Bulgaria",
                        organizationType: "Endowment Fund",
                        strategy: "Investor",
                        userType: "investor",
                        username: "seed1",
                        password: "passSeed1",
                        passwordConfirmation: "passSeed1",
                        terms: true,
                    },
                },
            },
        },
        EditPersonalInfo: {
            required: true,
            description: "JSON object with new personal info to update.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            firstName: {type: "string", required: true},
                            lastName: {type: "string", required: true},
                            title: {type: "string", enum: [userTitles]},
                            dateOfBirth: {type: "date-time", required: true},
                            jobPosition: {type: "string", required: true},
                            phone: {type: "number", required: true},
                            email: {type: "email", required: true},
                            street: {type: "string", required: true},
                            city: {type: "string", required: true},
                            zipCode: {type: "string", required: true},
                            state: {type: "string", required: true},
                            country: {type: "string", required: true},
                            avatar: {type: "dataUri"},
                        },
                    },
                    example: {
                        firstName: "John",
                        lastName: "Doe",
                        title: "mr.",
                        dateOfBirth: "2020-10-31T22:00:00.000Z",
                        jobPosition: "CEO",
                        phone: "+359894244323",
                        email: "test@example.com",
                        street: "Studentska 8",
                        city: "Ruse",
                        zipCode: "7000",
                        state: "Ruse",
                        country: "Bulgaria",
                        avatar: null,
                    },
                },
            },
        },
        EditCompanyInfo: {
            required: true,
            description: "JSON object with new company info to update.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            organizationName: {
                                type: "string",
                                required: true,
                            },
                            dateOfRegistration: {
                                type: "date-time",
                                required: true,
                            },
                            orgStreet: {
                                type: "string",
                                required: true,
                            },
                            orgCity: {
                                type: "string",
                                required: true,
                            },
                            orgState: {
                                type: "string",
                                required: true,
                            },
                            orgZipCode: {
                                type: "string",
                                required: true,
                            },
                            orgCountry: {
                                type: "string",
                                required: true,
                            },
                            organizationType: {
                                type: "string",
                                enum: [organizationTypes],
                            },
                            strategy: {
                                type: "string",
                                enum: [organizationStrategies],
                            },
                        },
                    },
                    example: {
                        organizationName: "ReCheck B.V",
                        dateOfRegistration: "2020-10-31T22:00:00.000Z",
                        orgStreet: "Tsar Kaloyan 11",
                        orgCity: "Ruse",
                        orgState: "Ruse",
                        orgZipCode: "7000",
                        orgCountry: "Bulgaria",
                        organizationType: "Management Company",
                        strategy: "Investor",
                    },
                },
            },
        },
        EditSettings: {
            required: true,
            description: "JSON object with new settings to update.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            projection: {type: "integer"},
                            price: {type: "integer"},
                            performance: {type: "integer"},
                            portfolio: {type: "integer"},
                        },
                    },
                    example: {
                        projection: 90,
                        price: 10,
                        performance: 30,
                        portfolio: 70,
                    },
                },
            },
        },
        EditPreferences: {
            required: true,
            description: "JSON object with new preferences to update.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            showDdLanding: {type: "boolean"},
                            showAnalyticsLanding: {type: "boolean"},
                            showNetworkLanding: {type: "boolean"},
                            showFundLanding: {type: "boolean"},
                            showExchangeLanding: {type: "boolean"},
                        },
                    },
                    example: {
                        showDdLanding: true,
                        showAnalyticsLanding: true,
                        showNetworkLanding: true,
                        showFundLanding: true,
                        showExchangeLanding: true,
                    },
                },
            },
        },
        updateRecheck: {
            required: true,
            description: "JSON object with token for update.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            recheckToken: {type: "string"},
                            returnChallenge: {type: "string"},
                        },
                    },
                    example: {
                        recheckToken: "cbcec8e0-3a30-11eb-b940-4389f8374847",
                        returnChallenge: "0x2c1750792962efcd653a9647d8fe8fc7a3cf7af896528a5ebc155bf292fce3a7",
                    },
                },
            },
        },
        CreateProject: {
            required: true,
            description: "JSON object with new project to create.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            encrProjectMap: {
                                type: "string",
                                required: true,
                            },
                            srcPubEncrKey: {
                                type: "string",
                                required: true,
                            },
                            projectType: {
                                type: "string",
                                enum: [projectTypes],
                                required: true,
                            },
                            currency: {
                                type: "string",
                                enum: [currencyTypes],
                                required: true,
                            },
                            companyName: {
                                type: "uuid",
                                required: true,
                            },
                            fundName: {
                                type: "uuid",
                                required: true,
                            },
                            fundType: {
                                type: "string",
                                enum: [fundTypes],
                                required: true,
                            },
                            projectName: {
                                type: "string",
                                required: true,
                            },
                            contactName: {
                                type: "uuid",
                                required: true,
                            },
                            contactPhone: {
                                type: "uuid",
                                required: true,
                            },
                            managerName: {
                                type: "uuid",
                                required: true,
                            },
                            contactEmail: {
                                type: "uuid",
                                required: true,
                            },
                            targetCommitment: {
                                type: "float",
                                required: true,
                            },
                            projectDeadline: {
                                type: "uuid",
                                required: true,
                            },
                            performanceScore: {
                                type: "uuid",
                                required: true,
                            },
                            portfolioScore: {
                                type: "uuid",
                                required: true,
                            },
                            priceScore: {
                                type: "uuid",
                                required: true,
                            },
                            projectionScore: {
                                type: "uuid",
                                required: true,
                            },
                        },
                    },
                    example: {
                        encrProjectMap: "8hlZvXxUhdMVqKTZ",
                        srcPubEncrKey: "3JZXGUXQ21gozHQStQhbeTnY1oLVSrkyZFCcuwvsCMAHWiXpJB",
                        projectType: "Due Diligence",
                        currency: "EUR",
                        companyName: "a747f9e0-e66c-42dc-84ed-6d48a1803068",
                        fundName: "b747f9e0-e66c-42dc-84ed-6d48a1803068",
                        fundType: "Buyout",
                        projectName: "0x441750792962efcd653a9647d8fe8fc7a3cf7af896528a5ebc155bf292fce3a7",
                        contactName: "d747f9e0-e66c-42dc-84ed-6d48a1803068",
                        contactPhone: "e747f9e0-e66c-42dc-84ed-6d48a1803068",
                        managerName: "0747f9e0-e66c-42dc-84ed-6d48a1803068",
                        contactEmail: "ae5fa59d-9f50-497c-9539-ff5a4eec2d08",
                        targetCommitment: "10000000000",
                        projectDeadline: "2747f9e0-e66c-42dc-84ed-6d48a1803068",
                        performanceScore: "3747f9e0-e66c-42dc-84ed-6d48a1803068",
                        portfolioScore: "4747f9e0-e66c-42dc-84ed-6d48a1803068",
                        priceScore: "5747f9e0-e66c-42dc-84ed-6d48a1803068",
                        projectionScore: "6747f9e0-e66c-42dc-84ed-6d48a1803068",
                    },
                },
            },
        },
        EditProject: {
            required: true,
            description: "JSON object with new project to edit.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            encrProjectMap: {
                                type: "string",
                                required: true,
                            },
                            srcPubEncrKey: {
                                type: "string",
                                required: true,
                            },
                            projectType: {
                                type: "string",
                                enum: [projectTypes],
                                required: false,
                            },
                            currency: {
                                type: "string",
                                enum: [currencyTypes],
                                required: false,
                            },
                            companyName: {
                                type: "uuid",
                                required: false,
                            },
                            fundName: {
                                type: "uuid",
                                required: false,
                            },
                            fundType: {
                                type: "string",
                                enum: [fundTypes],
                                required: false,
                            },
                            projectName: {
                                type: "string",
                                required: false,
                            },
                            contactName: {
                                type: "uuid",
                                required: false,
                            },
                            contactPhone: {
                                type: "uuid",
                                required: false,
                            },
                            managerName: {
                                type: "uuid",
                                required: false,
                            },
                            contactEmail: {
                                type: "uuid",
                                required: false,
                            },
                            targetCommitment: {
                                type: "float",
                                required: false,
                            },
                            projectDeadline: {
                                type: "uuid",
                                required: false,
                            },
                            performanceScore: {
                                type: "uuid",
                                required: false,
                            },
                            portfolioScore: {
                                type: "uuid",
                                required: false,
                            },
                            priceScore: {
                                type: "uuid",
                                required: false,
                            },
                            projectionScore: {
                                type: "uuid",
                                required: false,
                            },
                        },
                    },
                    example: {
                        encrProjectMap: "9hlZvXxUhdMVqKTZ",
                        srcPubEncrKey: "4JZXGUXQ21gozHQStQhbeTnY1oLVSrkyZFCcuwvsCMAHWiXpJB",
                        projectName: "0x331750792962efcd653a9647d8fe8fc7a3cf7af896528a5ebc155bf292fce3a7",
                        targetCommitment: "20000000000",
                    },
                },
            },
        },
        verifyUserEmailAndPutRecheckInfo: {
            required: true,
            description: "JSON object with use verify credentials",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            userId: {type: "int"},
                            token: {type: "uuid"},
                            recheckId: {type: "string"},
                            pubEncrKey: {type: "string"},
                            recheckToken: {type: "uuid"},
                            keysDataId: {type: "string"},
                        },
                    },
                    example: {
                        userId: 1,
                        token: "f747f9e0-e66c-42dc-84ed-6d48a1803068",
                        recheckId: "re_ss3HAQPSjyMRHsmKfjwhHJNPFMq1ghouykb95teN61cVZ2kxj",
                        pubEncrKey: "3rXZh5YEJ11GXNP37CUdaASTYEobKumXfVUmboUPtohfnfGik",
                        recheckToken: "be5a07d0-3a2e-11eb-b940-4389f8374847",
                        keysDataId: "0x2c1750792962efcd653a9647d8fe8fc7a3cf7af896528a5ebc155bf292fce3a7",
                    },
                },
            },
        },
        UploadDocument: {
            required: true,
            description: "JSON object with document upload info to create.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            projectId: {
                                type: "integer",
                                required: false,
                            },
                            documentDataId: {
                                type: "string",
                                required: true,
                            },
                            documentName: {
                                type: "string",
                                required: true,
                            },
                            documentExtension: {
                                type: "string",
                                required: true,
                            },
                        },
                    },
                    example: {
                        projectId: 8001,
                        documentDataId: "0x551750792962efcd653a9647d8fe8fc7a3cf7af896528a5ebc155bf292fce3a7",
                        documentName: "example",
                        documentExtension: ".pdf",
                    },
                },
            },
        },
        UploadTemplate: {
            required: true,
            description: "JSON object with template upload info to create.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            projectId: {
                                type: "integer",
                                required: true,
                            },
                            currency: {
                                type: "string",
                                required: true,
                            },
                            dataId: {
                                type: "integer",
                                required: true,
                            },
                            encrTemplateMap: {
                                type: "string",
                                required: true,
                            },
                            srcPubEncrKey: {
                                type: "string",
                                required: true,
                            },
                        },
                    },
                    example: {
                        projectId: 8001,
                        currency: "EUR",
                        dataId: 9001,
                        encrTemplateMap: "7hlZvXxUhdMVqKTZ",
                        srcPubEncrKey: "2JZXGUXQ21gozHQStQhbeTnY1oLVSrkyZFCcuwvsCMAHWiXpJB",
                        historyData: [{
                            "fundId": "781bf03e-bab0-4451-9b91-6277648d612f",
                            "quarterSinceInception": 1,
                            "periodicContribution": 487.35060000000004,
                            "periodicDistribution": 0,
                            "endOfQuarterNAV": 412.03770000000003
                        }, {
                            "fundId": "899d4c66-81ab-478d-92da-ce03dd167716",
                            "quarterSinceInception": 2,
                            "periodicContribution": 452.66459999999995,
                            "periodicDistribution": 0,
                            "endOfQuarterNAV": 1020.9984000000001
                        }],
                        snapshotData: [{
                            "fundId": "b80c27f7-3518-45c4-9996-4ce9e294b467",
                            "fundStrategy": "Buyout",
                            "vintage": 2020,
                            "totalCommitment": 7995,
                            "growthRate": 0.03,
                            "statusOfFund": "Pipeline",
                            "fundUsage": "Due Diligence",
                            "priceForCalibration": -77777,
                            "associatedWithFund": "c9824857-7df3-47c8-9b08-96e6f140c728"
                        }, {
                            "fundId": "40459b0f-cc79-4652-966d-47f2d337e23e",
                            "fundStrategy": "Venture Capital",
                            "vintage": 2004,
                            "totalCommitment": 3936,
                            "growthRate": 0.06,
                            "statusOfFund": "Seasoned",
                            "fundUsage": "Performance Sample",
                            "priceForCalibration": -77777,
                            "associatedWithFund": "90ab6de1-e2a0-4a7c-a89d-d2f11d189a46"
                        }, {
                            "fundId": "080ea465-384e-4b03-9751-83892e89abd9",
                            "fundStrategy": "Venture Capital",
                            "vintage": 2004,
                            "totalCommitment": 4927,
                            "growthRate": 0.06,
                            "statusOfFund": "Seasoned",
                            "fundUsage": "Price Calibration",
                            "priceForCalibration": 453,
                            "associatedWithFund": "05e674c9-633d-493c-bcbd-c5d2e7625485"
                        }],
                        leverageData: [{
                            "fundId": "614797ae-c75f-41d5-a743-da97ebdf5034",
                            "subscriptionLineDrawnAmount": 100,
                            "subscriptionLineLimitAmount": 150,
                            "NAVBasedDebt": 70,
                            "otherFundLevelDebt": 0
                        }],
                        portfolioData: [{
                            "fundId": "86bf5464-d366-41fc-a982-9d2be3dbd3a5",
                            "companyName": "a6890243-5794-41cf-a0de-19e00dc04447",
                            "companyAddress": "cf02d98e-a4d8-4006-8fd9-c81f334b8ab9",
                            "companySector": "Consumer",
                            "companyLocation": "United States",
                            "percentageWeightInFund": 5,
                            "companyBalanceSheetDE": 0.01847310420777648,
                            "numberOfEmployees": 122,
                            "latestAnnualCompanyRevenue": 786960.9471247881,
                            "latestEBITDA": 157392.19,
                        }, {
                            "fundId": "3c028195-6a03-46b4-90ee-66740d7e42ae",
                            "companyName": "d3d31e22-5453-4f78-8cb4-7f2c7b54b471",
                            "companyAddress": "245bb7bd-8f7c-433a-92ac-c36ab3483125",
                            "companySector": "Technology",
                            "companyLocation": "United States",
                            "percentageWeightInFund": 12,
                            "companyBalanceSheetDE": 0.802861725733229,
                            "numberOfEmployees": 839,
                            "latestAnnualCompanyRevenue": 86591.91170099979,
                            "latestEBITDA": 118283,
                        }, {
                            "fundId": "c1b36738-1c1b-4c40-9deb-7258b28fb81a",
                            "companyName": "8251190d-200a-47e1-b563-a8da44a07165",
                            "companyAddress": "035f4758-d814-4cb4-87a5-3df0f5bcd98b",
                            "companySector": "Health",
                            "companyLocation": "Italy",
                            "percentageWeightInFund": 8,
                            "companyBalanceSheetDE": 0.12627360473002358,
                            "numberOfEmployees": 328,
                            "latestAnnualCompanyRevenue": 239845.08718734555,
                            "latestEBITDA": 153350.68,
                        }],
                        portfolioType: "PE_Fund_portfolio_companies",
                    },
                },
            },
        },
        EditUserCredentials: {
            required: true,
            description: "JSON object with new user credentials to update.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            keysDataId: {type: "string", required: false},
                        },
                    },
                    example: {
                        keysDataId: "0x771750792962efcd653a9647d8fe8fc7a3cf7af896528a5ebc155bf292fce3a7",
                    },
                },
            },
        },
    },
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "Bearer",
            bearerFormat: "JWT",
        },
    },
};

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "xChain API",
            description: "xChain Prototype API",
            contact: {
                name: "xChain LTD",
            },
        },
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        servers: [
            {
                url: config.backendUrl,
                description: "Default server",
            },
            {
                url: "http://xchain.biz:4000",
                description: "xChain DEV Server",
            },
            {
                url: "http://localhost:4000",
                description: "Local server",
            },
        ],

        components: reusableDefinitions,
    },
    apis: [`${config.projectDirPath}/api/controllers/*.js`],
};

const swaggerUIOptions = {
    customSiteTitle: "xChain API",
    customCss: ".swagger-ui .response-col_description p { margin: 0; }",
    swaggerOptions: {
        responseInterceptor: (res) => {
            try {
                if (res.url.endsWith("login") && JSON.parse(res.data).data.token) {
                    //TODO fix automatic authorize
                    document.querySelector(".btn.authorize.unlocked").click();
                    document.querySelector(".modal-ux input[type='text']").value = JSON.parse(res.data).data.token;
                }
            } catch (ignored) {
                console.log(ignored);
            }

            return res;
        },
    },
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);


module.exports = {
    setSwagger: (app) => {
        app.get("/docs.json", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.send(swaggerDocs);
        });

        app.use(
            "/docs",
            swaggerUIExpress.serve,
            swaggerUIExpress.setup(swaggerDocs, swaggerUIOptions),
        );
    }
};
