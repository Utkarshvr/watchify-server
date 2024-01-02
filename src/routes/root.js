const express = require("express");
const authRoute = require("./auth.routes.js");
const uploadRoute = require("./upload.routes.js");
const roughRouter = require("./rough.routes.js");
const userRouter = require("./user.routes.js");
const videoRouter = require("./video.routes.js");
// const subscriberRouter = require("./subscribe.routes.js");
const likesRouter = require("./likes.routes.js");
const channelRouter = require("./channel.routes.js");
const playlilstRouter = require("./playlist.routes.js");

const rootRoute = express.Router();

rootRoute.use("/auth", authRoute);

rootRoute.use("/user", userRouter);

rootRoute.use("/channel", channelRouter);

rootRoute.use("/video", videoRouter);

rootRoute.use("/playlist", playlilstRouter);

// rootRoute.use("/subscriber", subscriberRouter);

rootRoute.use("/like", likesRouter);

// ROUGH
rootRoute.use("/rough", roughRouter);
rootRoute.use("/upload", uploadRoute);

module.exports = rootRoute;
