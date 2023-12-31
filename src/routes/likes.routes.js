const express = require("express");
const { likeContent } = require("../controllers/likes.controller");

const likesRouter = express.Router();

likesRouter.post("/:contentID", likeContent);

module.exports = likesRouter;
