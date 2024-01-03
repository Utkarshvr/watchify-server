const asyncHandler = require("express-async-handler");
const Videos = require("../models/Videos");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { generateVideoId } = require("../helpers/utility");
const {
  Types: { ObjectId },
} = require("mongoose");
const WatchHistory = require("../models/WatchHistory");

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
      $match: {
        // _id: new ObjectId("658d6fd765b6e96cfd215d55"),
        videoID,
      },
    },
    {
      $lookup: {
        from: "playlists",
        localField: "_id",
        foreignField: "videos",
        as: "likes",
        pipeline: [
          {
            $match: {
              title: "Liked Videos",
            },
          },
        ],
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
      $lookup: {
        from: "watch-histories",
        localField: "_id",
        foreignField: "video",
        as: "views",
      },
    },
    {
      $addFields: {
        likes_count: { $size: "$likes" },
        isLiked: {
          $cond: {
            if: {
              $in: [new ObjectId(userID), "$likes.owner"],
            },
            then: true,
            else: false,
          },
        },
        creator: {
          $first: "$creator",
        },

        views_count: { $size: "$views" },
        isViewed: {
          $cond: {
            if: {
              $in: [new ObjectId(userID), "$views.viewer"],
            },
            then: true,
            else: false,
          },
        },
        lastWatched: {
          $let: {
            vars: {
              matchedView: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$views",
                      as: "view",
                      cond: {
                        $eq: ["$$view.viewer", new ObjectId(userID)],
                      },
                    },
                  },
                  0,
                ],
              },
            },
            in: "$$matchedView.lastWatched",
          },
        },
      },
    },
  ]);

  const isAlreadyWatched = await WatchHistory.findOne({
    viewer: userID,
    video: video[0]?._id,
  }).lean();
  // Check if the video exists in the user's watch history
  const historyResponse = await WatchHistory.findOneAndUpdate(
    { viewer: userID, video: video[0]?._id },
    { $set: { lastWatched: new Date() } }, // Set additional fields as needed
    { upsert: true, new: true } // "upsert" creates the document if it doesn't exist, "new" returns the modified document
  ).lean();
  console.log({ historyResponse });

  // const video = await Videos.aggregate([
  //   {
  //     $lookup: {
  //       from: "likes",
  //       localField: "_id",
  //       foreignField: "video",
  //       as: "likes",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "creator",
  //       foreignField: "_id",
  //       as: "creator",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "watch-histories",
  //       localField: "videoID",
  //       foreignField: "video",
  //       as: "views",
  //     },
  //   },
  //   {
  //     $addFields: {
  //       likes_count: { $size: "$likes" },
  //       isLiked: {
  //         $cond: {
  //           if: {
  //             $in: [new ObjectId(userID), "$likes.likedBy"],
  //           },
  //           then: true,
  //           else: false,
  //         },
  //       },
  //       creator: {
  //         $first: "$creator",
  //       },

  //       views_count: { $size: "$views" },
  //       isViewed: {
  //         $cond: {
  //           if: {
  //             $in: [new ObjectId(userID), "$views.viewer"],
  //           },
  //           then: true,
  //           else: false,
  //         },
  //       },
  //       lastWatched: {
  //         $let: {
  //           vars: {
  //             matchedView: {
  //               $arrayElemAt: [
  //                 {
  //                   $filter: {
  //                     input: "$views",
  //                     as: "view",
  //                     cond: {
  //                       $eq: ["$$view.viewer", new ObjectId(userID)],
  //                     },
  //                   },
  //                 },
  //                 0,
  //               ],
  //             },
  //           },
  //           in: "$$matchedView.lastWatched",
  //         },
  //       },
  //     },
  //   },
  //   {
  //     $match: {
  //       // _id: new ObjectId("658d6fd765b6e96cfd215d55"),
  //       videoID,
  //     },
  //   },
  // ]);

  res.status(200).json({
    video: {
      ...video[0],
      views_count: isAlreadyWatched
        ? video[0]?.views_count
        : video[0]?.views_count + 1,
    },
    isViewed: isAlreadyWatched,
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
        from: "playlists",
        localField: "_id",
        foreignField: "videos",
        as: "likes",
        pipeline: [
          {
            $match: {
              title: "Liked Videos",
            },
          },
        ],
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
      $lookup: {
        from: "watch-histories",
        localField: "_id",
        foreignField: "video",
        as: "views",
      },
    },
    {
      $addFields: {
        likes_count: { $size: "$likes" },
        isLiked: {
          $cond: {
            if: {
              $in: [new ObjectId(userID), "$likes.owner"],
            },
            then: true,
            else: false,
          },
        },
        creator: {
          $first: "$creator",
        },

        views_count: { $size: "$views" },
        isViewed: {
          $cond: {
            if: {
              $in: [new ObjectId(userID), "$views.viewer"],
            },
            then: true,
            else: false,
          },
        },
        lastWatched: {
          $let: {
            vars: {
              matchedView: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$views",
                      as: "view",
                      cond: {
                        $eq: ["$$view.viewer", new ObjectId(userID)],
                      },
                    },
                  },
                  0,
                ],
              },
            },
            in: "$$matchedView.lastWatched",
          },
        },
      },
    },
  ]).sort({ createdAt: -1 });

  // const videos = await Videos.aggregate([
  //   {
  //     $lookup: {
  //       from: "likes",
  //       localField: "_id",
  //       foreignField: "video",
  //       as: "likes",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "creator",
  //       foreignField: "_id",
  //       as: "creator",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "watch-histories",
  //       localField: "videoID",
  //       foreignField: "video",
  //       as: "views",
  //     },
  //   },
  //   {
  //     $addFields: {
  //       likes_count: { $size: "$likes" },
  //       isLiked: {
  //         $cond: {
  //           if: {
  //             $in: [new ObjectId(userID), "$likes.likedBy"],
  //           },
  //           then: true,
  //           else: false,
  //         },
  //       },
  //       creator: {
  //         $first: "$creator",
  //       },

  //       views_count: { $size: "$views" },
  //       isViewed: {
  //         $cond: {
  //           if: {
  //             $in: [new ObjectId(userID), "$views.viewer"],
  //           },
  //           then: true,
  //           else: false,
  //         },
  //       },
  //       lastWatched: {
  //         $let: {
  //           vars: {
  //             matchedView: {
  //               $arrayElemAt: [
  //                 {
  //                   $filter: {
  //                     input: "$views",
  //                     as: "view",
  //                     cond: {
  //                       $eq: ["$$view.viewer", new ObjectId(userID)],
  //                     },
  //                   },
  //                 },
  //                 0,
  //               ],
  //             },
  //           },
  //           in: "$$matchedView.lastWatched",
  //         },
  //       },
  //     },
  //   },
  // ]).sort({ createdAt: -1 });

  res.status(200).json({
    videos,
  });
});

module.exports = { createVideo, getVideoById, getAllVideos };
