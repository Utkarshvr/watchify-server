const asyncHandler = require("express-async-handler");
const Videos = require("../models/Videos");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { generateVideoId } = require("../helpers/utility");
const {
  Types: { ObjectId },
} = require("mongoose");

const createVideo = asyncHandler(async (req, res) => {
  // Your code for the CreateVideo function goes here
  const { title, desc, creator, isPublic } = req.body;

  console.log(req.body, req.files);

  const videoPath = req.files?.video ? req.files?.video[0]?.path : null;

  const thumbnailPath = req.files?.thumbnail
    ? req.files?.thumbnail[0]?.path
    : null;

  const uploadedVideo = videoPath ? await uploadOnCloudinary(videoPath) : null;

  const uploadedThumbnail = thumbnailPath
    ? await uploadOnCloudinary(thumbnailPath)
    : null;

  if (!uploadedVideo?.url)
    return res.status(400).json({ msg: "Couldn't upload video" });

  const videoID = generateVideoId(16);

  const newVideo = await Videos.create({
    title,
    desc,
    creator,
    link: uploadedVideo?.url,
    thumbnail: uploadedThumbnail?.url || "",
    videoID,
    isPublic: isPublic === null ? true : JSON.parse(isPublic),
  });

  res.status(201).json({
    video: newVideo,
    msg: "Video Uploaded Successfully",
  });
});

const getVideoById = asyncHandler(async (req, res) => {
  const videoID = req.params.id;
  const userID = req.user?.details?._id;

  const video = await Videos.aggregate([
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator",
      },
    },
    {
      $addFields: {
        likes_count: { $size: "$likes" },
        isLiked: {
          $cond: {
            if: {
              $in: [new ObjectId(userID), "$likes.likedBy"],
            },
            then: true,
            else: false,
          },
        },
        creator: {
          $first: "$creator",
        },
      },
    },
    {
      $match: {
        // _id: new ObjectId("658d6fd765b6e96cfd215d55"),
        videoID,
      },
    },
  ]);

  res.status(200).json({
    video: video[0],
  });
});

const getAllVideos = asyncHandler(async (req, res) => {
  // const videos = await Videos.find({ isPublic: true })
  //   .sort({
  //     createdAt: -1,
  //   })
  //   .populate("creator")
  //   .lean();
  const userID = req.user?.details?._id;

  const videos = await Videos.aggregate([
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator",
      },
    },
    {
      $addFields: {
        likes_count: { $size: "$likes" },
        isLiked: {
          $cond: {
            if: {
              $in: [new ObjectId(userID), "$likes.likedBy"],
            },
            then: true,
            else: false,
          },
        },
        creator: {
          $first: "$creator",
        },
      },
    },
  ]).sort({ createdAt: -1 });

  res.status(200).json({
    videos,
  });
});

module.exports = { createVideo, getVideoById, getAllVideos };
