function generateVideoId(length = 11) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let videoId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    videoId += characters.charAt(randomIndex);
  }

  return videoId;
}

module.exports = { generateVideoId };
