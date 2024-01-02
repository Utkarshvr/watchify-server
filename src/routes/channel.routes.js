const express = require("express");
const {
  getChannelByID,
  getSubscribers,
} = require("../controllers/channel.controller");
const { subsribeChannel } = require("../controllers/subscribe.controller");

const channelRouter = express.Router();

channelRouter.get("/:channelID", getChannelByID);
channelRouter.post("/:channelID/subscribe", subsribeChannel);
channelRouter.get("/:channelID/subscribers", getSubscribers);

module.exports = channelRouter;
