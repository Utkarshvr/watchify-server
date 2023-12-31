const expressAsyncHandler = require("express-async-handler");
const Likes = require("../models/Likes");
const Videos = require("../models/Videos");
const Comments = require("../models/Comments");

const likeContent = expressAsyncHandler(async function (req, res) {
  try {
    const contentType = req.query.contentType;
    const user = req.user?.details;
    const userID = user?._id;
    const contentID = req.params.contentID; // video-id or comment-id

    if (!contentType)
      return res.status(400).json({ msg: "contentType is not specified" });

    const Content = contentType === "video" ? Videos : Comments;

    const existingContent = await Content.findOne({
      ...(contentType === "video"
        ? { videoID: contentID }
        : { _id: contentID }),
    }).lean();

    console.log({ existingContent });

    if (!existingContent)
      return res.status(404).json({
        msg: `${contentType} not found`,
      });

    const commonFindingObj = {
      likedBy: userID,
      contentType,
      ...(contentType === "video"
        ? { video: existingContent?._id }
        : { comment: contentID }),
    };

    const isAlreadyLiked = await Likes.findOne(commonFindingObj).lean();

    if (isAlreadyLiked) {
      await Likes.deleteOne(commonFindingObj);
      return res.status(200).json({ msg: "Like Removed" });
    } else {
      await Likes.create(commonFindingObj);
      return res.status(200).json({ msg: "Like Added" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

module.exports = { likeContent };
