const express = require("express");
const upload = require("../middlewares/multer.middlewares");

const {
  customizeUser,
  getUserById,
  getNotifications,
  getUsersPlaylist,
  getUsersWatchHistory,
} = require("../controllers/user.controller");
const { isAuthorized } = require("../middlewares/auth.middleware");

const userRouter = express.Router();

// Check if user is authorized
userRouter.use(isAuthorized);

userRouter.get("/me", getUserById);
userRouter.get("/me/playlists", getUsersPlaylist);
userRouter.get("/me/watch-history", getUsersWatchHistory);

// Notifications
userRouter.get("/me/notifications", getNotifications);

userRouter.post(
  "/me/customize",
  upload.fields([
    { name: "user_picture", maxCount: 1 },
    { name: "banner_image", maxCount: 1 },
  ]),
  customizeUser
);

module.exports = userRouter;
