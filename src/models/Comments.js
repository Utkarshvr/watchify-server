const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    videoID: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comments = model("Comment", commentSchema);

module.exports = Comments;
