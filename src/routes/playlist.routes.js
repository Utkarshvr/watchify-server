const express = require("express");
const {
  createPlaylist,
  addVideosToPlaylist,
  addVideoToPlaylists,
  toggleVideoInPlaylist,
} = require("../controllers/playlist.controller");

const playlilstRouter = express.Router();

// playlilstRouter.route("/:playlistID").post(createPlaylist);
playlilstRouter.route("/").post(createPlaylist);

playlilstRouter.route("/:playlistID/add-videos").post(addVideosToPlaylist);
playlilstRouter.route("/:playlistID/toggle-video").post(toggleVideoInPlaylist);

playlilstRouter.post("/add-video-to-playlists", addVideoToPlaylists);

module.exports = playlilstRouter;
