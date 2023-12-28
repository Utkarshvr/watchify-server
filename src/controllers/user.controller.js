const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const Videos = require("../models/Videos");

const customizeUser = asyncHandler(async (req, res) => {
  const { name, user_handle, links } = req.body;

  // Try to update the basic info first
  let updatedUser = await User.findByIdAndUpdate(
    req.params.id,

    {
      $set: { name, user_handle, links },
    },

    { new: true } // This option returns the modified document, rather than the original
  ).lean();
  console.log(updatedUser);

  // Upload Images to Cloudinary
  console.log(req.files);

  const user_picturePath = req.files?.user_picture
    ? req.files?.user_picture[0]?.path
    : null;
  const banner_imagePath = req.files?.banner_image
    ? req.files?.banner_image[0]?.path
    : null;

  const uploadedUserPic = user_picturePath
    ? await uploadOnCloudinary(user_picturePath)
    : null;

  const uploadedBannerPic = banner_imagePath
    ? await uploadOnCloudinary(banner_imagePath)
    : null;

  if (uploadedUserPic?.url || uploadedBannerPic?.url) {
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,

      {
        $set: {
          ...(uploadedUserPic?.url && { picture: uploadedUserPic.url }),
          ...(uploadedBannerPic?.url && {
            banner_image: uploadedBannerPic.url,
          }),
        },
      },

      { new: true } // This option returns the modified document, rather than the original
    ).lean();
  }

  console.log(updatedUser);

  res.status(200).json({
    updatedUser,
    msg: "Successfully Customized",
  });
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ user, msg: "User Fetched Successfully" });
  } catch (error) {
    res.status(500).json({ error, msg: "Internal Server Error" });
  }
});

const getVideosByUser = asyncHandler(async (req, res) => {
  const videos = await Videos.find({
    isPublic: true,
    creator: req.params.id,
  })
    .populate("creator")
    .lean();

  res.status(200).json({
    videos,
  });
});

module.exports = { customizeUser, getUserById, getVideosByUser };
