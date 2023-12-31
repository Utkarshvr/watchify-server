const expressAsyncHandler = require("express-async-handler");
const Subscribers = require("../models/Subscribers");
const User = require("../models/User");

const subsribeChannel = expressAsyncHandler(async function (req, res) {
  try {
    const user = req.user?.details;
    const subscriberID = user?._id;
    const channelID = req.params.channelID;

    const commonObj = {
      subscriber: subscriberID,
      channel: channelID,
    };

    const exisitingVideo = User.findById(channelID);
    if (!exisitingVideo)
      return res
        .status(404)
        .json({ msgL: `Channel with ID: ${channelID} is not found` });

    const isAlreadySubscribed = await Subscribers.findOne(commonObj).lean();

    if (isAlreadySubscribed) {
      await Subscribers.deleteOne(commonObj);
      return res.status(200).json({ msg: "Unsubscribed" });
    } else {
      await Subscribers.create(commonObj);
      return res.status(200).json({ msg: "Subscribed" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = { subsribeChannel };
