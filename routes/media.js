var express = require("express");
var router = express.Router();
const fluentFfmpeg = require("fluent-ffmpeg");
require("dotenv").config();
const {
  addEntitiy,
  getEntities,
  getEntitiesById,
  updateEntityById,
} = require("../utils/dynamo");

router.post("/addMusic", async (req, res) => {
  const contentCheck = await getEntities("Phase0_content");

  let existingIds = [];
  contentCheck.Items.forEach((item) => {
    existingIds.push(Number(item.content_id));
  });

  let content_id = Math.max(...existingIds) + 1;

  let Count = [];
  contentCheck.Items.forEach((item) => {
    Count.push(Number(item.count));
  });

  let __count = Math.max(...Count) + 1;
  // do {
  //   content_id = Math.floor(10000 + Math.random() * 90000);
  // } while (existingIds.includes(content_id));
  // console.log("x",existingIds,"\ny",content_id)
  const _id = "00" + content_id.toString();
  const contentData = {
    content_id: _id,
    music: req.body.music,
    thumbnail: req.body.thumbnail,
    count: __count,
    title: req.body.title,
    artist: req.body.artist,
    email: req.body.email,
    phone: req.body.phone ? req.body.phone : null,
    instagram: req.body.instagram ? req.body.instagram : null,
    facebook: req.body.facebook ? req.body.facebook : null,
    twitter: req.body.twitter ? req.body.twitter : null,
    _isFeatured: false,
    _isPlaying: false,
  };
  try {
    await addEntitiy("Phase0_content", contentData);
    const data = await getEntitiesById("Phase0_content", { content_id: _id });
    console.log("Data saved:", data);
    res.status(200).json({
      status: "Submitted successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

async function getMp3Duration(song) {
  try {
    // Create a readable stream from S3 object
    // const s3Stream = s3
    //   .getObject({ Bucket: bucketName, Key: objectKey })
    //   .createReadStream();

    return new Promise((resolve, reject) => {
      // Get the duration using fluent-ffmpeg
      fluentFfmpeg()
        .input(song)
        .on("end", function () {
          resolve(this._duration);
        })
        .on("error", function (err) {
          reject(err);
        })
        .run();
    });
  } catch (error) {
    console.log("EEE")
    throw error;
  }
}

router.get("/get/user", async (req, res) => {
  try {
    const users = await getEntities("Phase0_content");
    //sort by count
    users.Items.sort((a, b) => {
      return a.count - b.count;
    });

    // getMp3Duration("https://aaikyam-music.s3.ap-south-1.amazonaws.com/music/1699396922684-dopamine_pleasures-1.mp3")
    //   .then((duration) => {
    //     console.log(`Duration of the music file: ${duration} seconds`);
    //   })
    //   .catch((error) => {
    //     console.error("Error getting music duration:", error.message);
    //   });
// console.log("aaee", users.Items[0].music)
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// api to change status of isFearured to true by taking contentId in url params by using updateEntityById function
router.get("/update/featured/:contentId", async (req, res) => {
  const contentId = req.params.contentId;
  const contentData = await getEntitiesById("Phase0_content", {
    content_id: contentId,
  });
  const updatedData = await updateEntityById(
    "Phase0_content",
    { content_id: contentId },
    "_isFeatured",
    true
  );
  const updatedData1 = await updateEntityById(
    "Phase0_content",
    { content_id: contentId },
    "_isPlaying",
    false
  );
  res.status(200).send({ updatedData, updatedData1 });
});

router.get("/update/playStatus/:contentId", async (req, res) => {
  const contentId = req.params.contentId;
  const contentData = await getEntitiesById("Phase0_content", {
    content_id: contentId,
  });
  const data = await updateEntityById(
    "Phase0_content",
    { content_id: contentId },
    "_isPlaying",
    true
  );

  res.status(200).send(data);
});

module.exports = router;
