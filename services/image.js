const { images } = require("../db").getDBModels();
const { logger } = require("../logger");

const imageService = {
    create: {
        one: async (imageObj) => {
            try {
                return await images.create(imageObj);
            } catch (error) {
                logger.error(error);
                throw error;
            }
        }
    },
    find: {
        one: async (id) => {
            try {
                return await images.findOne({ where: { id } });
            } catch (error) {
                logger.error(error);
                throw error;
            }
        },
        all: async () => {
            try {
                return await images.findAll();
            } catch (error) {
                logger.error(error);
                throw error;
            }
        }
    },
    delete: {
        one: async (id) => {
            try {
                return await images.destroy({ where: { id } });
            } catch (error) {
                logger.error(error);
                throw error;
            }
        }
    }
};

imageService.uploadImage = async (imageObj) => {
    try {
        return await imageService.create.one(imageObj);
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

imageService.getAllData = async () => {
    try {
        return await imageService.find.all();
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

imageService.getImage = async (imageId) => {
    try {
        return await imageService.find.one(imageId);
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

imageService.deleteImage = async (imageId) => {
    try {
        // find imageId
        return await imageService.delete.one(imageId);
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

module.exports = imageService;
