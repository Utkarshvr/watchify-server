const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    //   Additional
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Comments = model("Comment", commentSchema);

module.exports = Comments;
