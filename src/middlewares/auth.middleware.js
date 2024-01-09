const expressAsyncHandler = require("express-async-handler");
const sendRes = require("../utils/sendRes");

const isAuthorized = expressAsyncHandler((req, res, next) => {
  const user = req.user?.details;

  // console.log({ isAuthorized: !!user, user });

  if (user) return next();

  return sendRes(
    res,
    403,
    null,
    "You must be logged in to perform this activity"
  );
});

module.exports = { isAuthorized };
