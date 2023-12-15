const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
var router = express.Router();
const {
  addEntitiy,
  getEntities,
  getEntitiesById,
  updateEntityById,
  getEntitiesByAttribute,
} = require("../utils/dynamo");

router.post("/artist/upload", async (req, res) => {
  const uploadAudio = {
    music: req.body.music,
    title: req.body.title,
    tags: req.body.tags,
    genre: req.body.genre,
    thumbnail: req.body.thumbnail,
    mainArtist: req.body.main_artist,
    credits : req.body.credits,
    listingPrice: req.body.price,
    _isCopyrighted : req.body.isCopyrighted,
    _containsMusic : req.body.musicPresence,
    _isOnYt: req.body.onYt,
    _ytUrls: req.body.ytUrls,
    _isAssetized:false
  }
  try {
    //  DB Operations Left
    res.status(200).json({
      status:"Submitted successfully",
      data
    })
  } catch (error) {
    res.status(500).send({error})
  }
});

