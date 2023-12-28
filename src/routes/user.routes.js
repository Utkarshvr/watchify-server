const express = require("express");
const upload = require("../middlewares/multer.middlewares");

const {
  customizeUser,
  getUserById,
} = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.get("/:id", getUserById);

userRouter.post(
  "/:id/customize",
  upload.fields([
    { name: "user_picture", maxCount: 1 },
    { name: "banner_image", maxCount: 1 },
  ]),
  customizeUser
);

module.exports = userRouter;
