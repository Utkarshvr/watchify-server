const express = require("express");
const upload = require("../middlewares/multer.middlewares");
const User = require("../models/User");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const expressAsyncHandler = require("express-async-handler");

const userRouter = express.Router();

userRouter.get("/:id", (req, res) => {
  res.send(req.user);
});

userRouter.post(
  "/:id/customize",
  upload.fields([
    { name: "user_picture", maxCount: 1 },
    { name: "banner_image", maxCount: 1 },
  ]),
  expressAsyncHandler(async (req, res) => {
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
  })
);

module.exports = userRouter;
