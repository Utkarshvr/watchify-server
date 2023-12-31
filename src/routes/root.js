const express = require("express");
const authRoute = require("./auth.routes.js");
const uploadRoute = require("./upload.routes.js");
const roughRouter = require("./rough.routes.js");
const userRouter = require("./user.routes.js");
const videoRouter = require("./video.routes.js");
const subscriberRouter = require("./subscribe.routes.js");
const likesRouter = require("./likes.routes.js");

const rootRoute = express.Router();

rootRoute.use("/auth", authRoute);

rootRoute.use("/upload", uploadRoute);

rootRoute.use("/user", userRouter);

rootRoute.use("/video", videoRouter);

rootRoute.use("/subscribe", subscriberRouter);

rootRoute.use("/like", likesRouter);

rootRoute.use("/rough", roughRouter);

module.exports = rootRoute;
