const express = require("express");
const authRoute = require("./auth.routes.js");
// const { createUploadthingExpressHandler } = require("uploadthing/express");
// const uploadRouter = require("../uploadthing.js");
const uploadRoute = require("./upload.routes.js");

const rootRoute = express.Router();

rootRoute.use("/auth", authRoute);

rootRoute.use("/upload", uploadRoute);

module.exports = rootRoute;
