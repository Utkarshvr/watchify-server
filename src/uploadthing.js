const {
  createUploadthing,
  createUploadthingExpressHandler,
} = require("uploadthing/express");

const f = createUploadthing();

const uploadRouter = {
  videoAndImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
    video: {
      maxFileSize: "256MB",
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
};

const uploaderThing = createUploadthingExpressHandler({
  router: uploadRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
});

module.exports = uploaderThing;
