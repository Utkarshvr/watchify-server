const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const randomNumber = require("../helpers/randomNumber");
const generateUniqueChannelID = require("../helpers/generateChannelID");
const Playlists = require("../models/Playlist");

const login = asyncHandler(async (req, res) => {
  // console.log("Request Reached");

  if (req.user) {
    // console.log(req.user);
    // 1. Extract email & all other necessary fields
    const { email, given_name, family_name, name, picture } = req.user._json;
    // // // console.log("detials", { email, given_name, family_name, name, picture });

    const userByEmail = await User.findOne({ email });
    // console.log("Existing User: ", !!userByEmail, userByEmail);

    // 2. if email already exists in the DB. Return it & it's done
    if (userByEmail) {
      if (
        !userByEmail.watch_later_playlist_id ||
        !userByEmail.liked_videos_playlist_id
      ) {
        const { watchLater, likedVideos } = await createDefaultPlaylists(
          userByEmail._id
        );
        userByEmail.watch_later_playlist_id = watchLater?._id;
        userByEmail.liked_videos_playlist_id = likedVideos?._id;
      }

      userByEmail.save();

      req.user.details = userByEmail;

      return res.status(200).json({
        error: false,
        message: "Successfully Logged In",
        // user: req.user,
        user: userByEmail,
      });
    }

    // console.log("Create a New One");
    let isUserHandleUnique = false;
    let isChannelIDUnique = false;
    let userHandle;
    let channelID;

    // 3. if email doesn't exist, it means it is a new account. So save the user with:
    // (a) Create a userHandle && Check until u find a unique channel id
    while (!isUserHandleUnique) {
      // Generate a new userHandle
      userHandle = `${given_name?.toLowerCase()}${
        family_name ? family_name?.toLowerCase() : ""
      }${randomNumber()}`;

      // Check if the generated userHandle already exists in the database
      const existingUser = await User.findOne({ user_handle: userHandle });
      // console.log("Unique: ", userHandle, !existingUser);

      // If no user is found with the generated userHandle, it's unique
      if (!existingUser) {
        isUserHandleUnique = true;
      }
    }
    while (!isChannelIDUnique) {
      // Generate a new channel id
      channelID = generateUniqueChannelID();

      // Check if the generated userHandle already exists in the database
      const existingUser = await User.findOne({ channelID });
      // console.log("Unique ", channelID, !existingUser);

      // If no user is found with the generated userHandle, it's unique
      if (!existingUser) {
        isChannelIDUnique = true;
      }
    }
    // // console.log("Is Handler Unique", isUserHandleUnique);
    // // console.log("Is Channel ID Unique", isChannelIDUnique);

    // (c) Create a new user

    const { watchLater, likedVideos } = await createDefaultPlaylists(
      newUser?._id
    );

    const userObj = {
      email,
      given_name,
      family_name,
      name,
      picture,
      user_handle: userHandle,
      channelID,
      desc: "",
      watch_later_playlist_id: watchLater?._id,
      liked_videos_playlist_id: likedVideos?._id,
    };
    // console.log(userObj);

    let newUser = await User.create(userObj);

    req.user.details = newUser;

    return res.status(201).json({
      error: false,
      message: "Successfully Sign up",
      user: newUser,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

async function createDefaultPlaylists(owner) {
  try {
    const watchLater = await Playlists.create({
      title: "Watch Later",
      isPrivate: true,
      isDefault: true,
      owner,
    });
    const likedVideos = await Playlists.create({
      title: "Liked Videos",
      isPrivate: true,
      isDefault: true,
      owner,
    });

    return { watchLater, likedVideos };
  } catch (error) {
    throw error;
  }
}

module.exports = { login };
