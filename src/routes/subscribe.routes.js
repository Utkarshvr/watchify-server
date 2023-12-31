const express = require("express");
const { subsribeChannel } = require("../controllers/subscribe.controller");

const subscriberRouter = express.Router();

subscriberRouter.post("/:channelID", subsribeChannel);

module.exports = subscriberRouter;
