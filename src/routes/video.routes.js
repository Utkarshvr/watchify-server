const express = require("express");
const upload = require("../middlewares/multer.middlewares");

const {
  createVideo,
  getVideoById,
  getAllVideos,
} = require("../controllers/videos.controller");

const videoRouter = express.Router();

videoRouter.get("/:id", getVideoById);

videoRouter.get("/all", getAllVideos);

videoRouter.post(
  "/create",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
);

module.exports = videoRouter;
