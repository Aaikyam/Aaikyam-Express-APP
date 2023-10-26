var express = require("express");
var router = express.Router();
require("dotenv").config();
const { addEntitiy,getEntities, getEntitiesById } = require("../utils/dynamo");

router.post("/addMusic", async (req, res) => {
  const contentCheck = await getEntities("Phase0_content");

  let existingIds = [];
  contentCheck.Items.forEach((item) => {
    existingIds.push(Number(item.content_id));
  });

  let content_id;
  do {
    content_id = Math.floor(10000 + Math.random() * 90000);
  } while (existingIds.includes(content_id));
  // console.log("x",existingIds,"\ny",content_id)
  const _id = "00"+content_id.toString()
  const contentData = {
    content_id: _id,
    music: req.body.music,
    title: req.body.title,
    artist: req.body.artist,
    email: req.body.email,
    phone: req.body.phone ? req.body.phone : null,
    instagram: req.body.instagram ? req.body.instagram : null,
    facebook: req.body.facebook ? req.body.facebook : null,
    twitter: req.body.twitter ? req.body.twitter : null,
  
  
  };
  try {
    await addEntitiy("Phase0_content", contentData)
    const data = await getEntitiesById("Phase0_content",{content_id:_id})
    console.log("Data saved:", data);
    res.status(200).json({
      status:"Submitted successfully",
      data
    })
  } catch (error) {
    res.status(500).send({error})
  }
});


module.exports = router;