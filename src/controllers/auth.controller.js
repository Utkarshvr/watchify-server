const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const randomNumber = require("../helpers/randomNumber");
const generateUniqueChannelID = require("../helpers/generateChannelID");

const login = asyncHandler(async (req, res) => {
  if (req.user) {
    // console.log(req.user);
    // 1. Extract email & all other necessary fields
    const { email, given_name, family_name, name, picture } = req.user._json;
    // // console.log("detials", { email, given_name, family_name, name, picture });

    const userByEmail = await User.findOne({ email });
    // console.log("Existing User: ", !!userByEmail, userByEmail);

    // 2. if email already exists in the DB. Return it & it's done
    if (userByEmail) {
      req.user.details = userByEmail;

      return res.status(200).json({
        error: false,
        message: "Successfully Logged In",
        // user: req.user,
        user: userByEmail,
      });
    }
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
      const existingUser = await User.findOne({ userHandle });

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

      // If no user is found with the generated userHandle, it's unique
      if (!existingUser) {
        isChannelIDUnique = true;
      }
    }
    // console.log("Is Handler Unique", isUserHandleUnique);
    // console.log("Is Channel ID Unique", isChannelIDUnique);

    // (c) Create a new user
    const userObj = {
      email,
      given_name,
      family_name,
      name,
      picture,
      userHandle,
      channelID,
    };

    let newUser = await User.create(userObj);
    // console.log("New User: ", newUser);
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

module.exports = { login };
