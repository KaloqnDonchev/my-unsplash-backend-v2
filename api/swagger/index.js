const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUIExpress = require("swagger-ui-express");

const config = require("../../config.js");

const reusableDefinitions = {
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "Bearer",
            bearerFormat: "JWT"
        }
    }
};

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "xChain API",
            description: "xChain Prototype API",
            contact: {
                name: "xChain LTD"
            }
        },
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        servers: [
            {
                url: config.server.backendPort,
                description: "Default server"
            },
            {
                url: "https://beta.recheck.io",
                description: "xChain DEV Server"
            },
            {
                url: `http://localhost:${config.server.backendPort}`,
                description: "Local server"
            }
        ],

        components: reusableDefinitions
    },
    apis: [`${config.projectDirPath}/api/controllers/*.js`]
};

const swaggerUIOptions = {
    customSiteTitle: "ReCheck API",
    customCss: ".swagger-ui .response-col_description p { margin: 0; }"
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
            swaggerUIExpress.setup(swaggerDocs, swaggerUIOptions)
        );
    }
};
