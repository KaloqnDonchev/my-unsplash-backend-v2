const { imageController } = require("../controllers");

module.exports = (router) => {
    router.post("/images", imageController.post.uploadFiles);
    router.get("/images", imageController.get.getAllImages);
    router.get("/images/:imageId", imageController.get.getImage);
    router.delete("/images/:imageId", imageController.delete.deleteImage);

    return router;
};
