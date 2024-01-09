const notificationTypes = {
  videoUpload: {
    root: "VIDEO-UPLOAD-",
    inProgress: function () {
      return this.root + "INPROGRESS";
    },
    success: function () {
      return this.root + "SUCCESS";
    },
    failed: function () {
      return this.root + "FAILED";
    },
  },
};

module.exports = notificationTypes;
