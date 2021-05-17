const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUIExpress = require("swagger-ui-express");

const config = require("../../config.js");

const reusableDefinitions = {
    requestBodies: {
        uploadImage: {
            required: true,
            description: "JSON object for upload image.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            label: { type: "string" },
                            type: { type: "string" },
                            sizeBytes: { type: "integer" },
                            data: { type: "integer" }
                        }
                    },
                    example: {
                        label: "snimka",
                        type: "image/jpeg",
                        sizeBytes: 500,
                        data: 1273868123
                    }
                }
            }
        }
    }
};

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "MyUnsplash API",
            description: "MyUnsplash Prototype API",
            contact: {
                name: "MyUnsplash LTD"
            }
        },
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        servers: [
            {
                url: `http://localhost:${config.backendPort}`,
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
