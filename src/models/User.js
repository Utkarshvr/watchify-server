const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    given_name: {
      type: String,
      required: true,
    },
    family_name: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      default: "",
      required: false,
    },
    picture: {
      type: String,
      required: false,
    },
    banner_image: {
      type: String,
      required: false,
    },
    watch_later_playlist_id: {
      type: String,
      required: true,
      unique: true,
    },
    liked_videos_playlist_id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    user_handle: {
      type: String,
      required: true,
      unique: true,
    },
    channelID: {
      type: String,
      required: true,
      unique: true,
    },
    links: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
