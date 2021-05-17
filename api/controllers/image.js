const imageService = require("../../services/image.js");
const { logger } = require("../../logger")

const imageApis = {
    get: {
        /**
         * @swagger
         *
         * /images:
         *   get:
         *     tags:
         *       - Image Controller
         *     summary: Get all images
         *     description: Get all images
         *     responses:
         *       200:
         *         description: Success - image shown
         *       500:
         *         description: Internal Server Error
         */
        async getAllImages(req, res) {
            try {
                const allImages = await imageService.getAllData();
                if (allImages) {
                    res.send(allImages);
                } else {
                    res.send("No images found");
                    console.log("No images found"); // both or just one?
                }
            } catch (error) {
                logger.error(error);
                res.send(`Error when trying to get all images: ${error}`); // both or just one?
            }
        },
        /**
         * @swagger
         *
         * /images/{imageId}:
         *   get:
         *     tags:
         *       - Image Controller
         *     summary: Get image
         *     description: Get image
         *     parameters:
         *       - in: path
         *         name: imageId
         *         schema:
         *           type: integer
         *         required: true
         *     responses:
         *       200:
         *         description: Success - images shown
         *       500:
         *         description: Internal Server Error
         */
        async getImage(req, res) {
            try {
                const imageObj = await imageService.getImage(req.params.imageId);
                if (imageObj) {
                    res.send(imageObj);
                } else {
                    res.send("No image found");
                    console.log("No image found");
                }
            } catch (error) {
                logger.error(error);
                res.send(`Error when trying to get image with id ${req.params.imageId}: ${error}`);
            }
        }
    },
    post: {
        /**
         * @swagger
         *
         * /images:
         *   post:
         *     tags:
         *       - Image Controller
         *     summary: Upload image
         *     description: Upload image
         *     requestBody:
         *          $ref: '#/components/requestBodies/uploadImage'
         *     responses:
         *       200:
         *         description: Success - image uploaded
         *       500:
         *         description: Internal Server Error
         */
        async uploadFiles(req, res) {
            try {
                await imageService.uploadImage(req.body);

                res.send(`Image has been uploaded.`);
            } catch (error) {
                logger.error(error);
                res.send(`Error when trying upload images: ${error}`);
            }
        }
    },
    delete: {
        /**
         * @swagger
         *
         * /images/{imageId}:
         *   delete:
         *     tags:
         *       - Image Controller
         *     summary: Delete image
         *     description: Delete image
         *     parameters:
         *       - in: path
         *         name: imageId
         *         schema:
         *           type: integer
         *         required: true
         *     responses:
         *       200:
         *         description: Success - image deleted
         *       500:
         *         description: Internal Server Error
         */
        async deleteImage(req, res) {
            try {
                const deletedImage = await imageService.deleteImage(req.params.imageId);
                console.log(deletedImage);
                if (deletedImage) {
                    res.send(`Image has been deleted.`);
                } else {
                    res.send("No image found");
                    console.log("No image found");
                }
            } catch (error) {
                logger.error(error);
                res.send(
                    `Error when trying to delete image with id ${req.params.imageId}: ${error}`
                );
            }
        }
    }
};

module.exports = imageApis;
