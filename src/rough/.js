// const obj = {
//   existingVideos: [
//     "658d6fd765b6e96cfd215d55",
//     "658d706b65b6e96cfd215d57",
//     "658db85c435bf211e8c19aef",
//     "uniqueID",
//   ],
//   videos: [
//     "658d6fd765b6e96cfd215d55",
//     "658d706b65b6e96cfd215d57",
//     "658db85c435bf211e8c19aef",
//     "000000000111110000000000",
//     "000000002323232000000000",
//   ],
// };

// const uniqueVideos = obj.existingVideos.filter(
//   (videoId) => !obj.videos.includes(String(videoId))
// );

// const alreadyExistingIDs = obj.videos.filter((videoId) =>
//   obj.existingVideos.includes(String(videoId))
// );

// const UniqueIDsToBeAdded = obj.videos.filter(
//   (vid) => !alreadyExistingIDs.includes(String(vid))
// );
// console.log({
//   videosToBeAdded: obj.videos,
//   alreadyExistingIDs,
//   UniqueIDsToBeAdded,
// });

[1,2,3,4].find(e=>![1,2,3,4,5].includes(e))

const prev = [1,2,3,4,5]
const updated = [1,2,3,4]

const selected = prev.length>updated.length ? (
    prev.find(e=>!updated.includes(e))
): (
    updated.find(e=>!prev.includes(e))
)

console.log(selected);
