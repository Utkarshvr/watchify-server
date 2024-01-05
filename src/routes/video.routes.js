const express = require("express");
const upload = require("../middlewares/multer.middlewares");

const {
  createVideo,
  getVideoById,
  getAllVideos,
} = require("../controllers/videos.controller");
const { isAuthorized } = require("../middlewares/auth.middleware");

const videoRouter = express.Router();

videoRouter.get("/all", getAllVideos);

videoRouter.get("/:id", getVideoById);

videoRouter.post(
  "/create",
  isAuthorized,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
);

module.exports = videoRouter;
