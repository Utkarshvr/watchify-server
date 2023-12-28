const express = require("express");
const upload = require("../middlewares/multer.middlewares");

const roughRouter = express.Router();

roughRouter.post(
  "/upload/user_picture",

  upload.fields([
    { name: "user_picture", maxCount: 1 },
    { name: "banner_image", maxCount: 1 },
  ]),

  (req, res) => {
    console.log(req.files);
    console.log(req.body);

    res.status(201).json({
      files: req.files,
      body: req.body,
    });
  }
);

module.exports = roughRouter;
