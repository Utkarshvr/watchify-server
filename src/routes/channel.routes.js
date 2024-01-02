const express = require("express");
const {
  getChannelByID,
  getSubscribers,
  getChannel,
  getChannelsPlaylist,
} = require("../controllers/channel.controller");
const { subsribeChannel } = require("../controllers/subscribe.controller");
const { getVideosByUser } = require("../controllers/user.controller");

const channelRouter = express.Router();

channelRouter.get("/", getChannel);
channelRouter.get("/:channelID", getChannelByID);
channelRouter.get("/:channelID/videos", getVideosByUser);
channelRouter.get("/:channelID/playlists", getChannelsPlaylist);
channelRouter.post("/:channelID/subscribe", subsribeChannel);
channelRouter.get("/:channelID/subscribers", getSubscribers);

module.exports = channelRouter;
