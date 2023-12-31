const express = require("express");
const Subscribers = require("../models/Subscribers");

const subscriberRouter = express.Router();

subscriberRouter.post("/:channelID", async (req, res) => {
  try {
    const user = req.user?.details;
    const subscriberID = user?._id;
    const channelID = req.params.channelID;

    const isAlreadySubscribed = await Subscribers.findOne({
      subscriber: subscriberID,
      channel: channelID,
    }).lean();

    if (isAlreadySubscribed) {
      await Subscribers.deleteOne({
        subscriber: subscriberID,
        channel: channelID,
      });
      return res.status(200).json({ msg: "Unsubscribed" });
    } else {
      await Subscribers.create({
        subscriber: subscriberID,
        channel: channelID,
      });
      return res.status(200).json({ msg: "Subscribed" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = subscriberRouter;
