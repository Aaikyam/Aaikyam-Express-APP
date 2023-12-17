const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
var router = express.Router();
const mongoose = require('mongoose');
const UploadAudio = require('../models/schema')
const {addEntitiy, getEntities,getEntitiesById,updateEntityById,getEntitiesByAttribute,} = require("../utils/dynamo");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


router.post("/artist/upload", async (req, res) => { //authenticate artist
  const uploadAudioData = {
    music: req.body.music,
    title: req.body.title,
    tags: req.body.tags,
    genre: req.body.genre,
    thumbnail: req.body.thumbnail,
    mainArtist: req.body.main_artist,
    credits: req.body.credits,
    listingPrice: req.body.price,
    _isCopyrighted: req.body.isCopyrighted,
    _containsMusic: req.body.musicPresence,
    _isOnYt: req.body.onYt,
    _ytUrls: req.body.ytUrls,
    _isAssetized: false
  };

  try {
    const uploadAudio = new UploadAudio(uploadAudioData);
    const savedData = await uploadAudio.save();

    res.status(200).json({
      status: "Submitted successfully",
      data: savedData
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({ error });
  }
});

module.exports = router;