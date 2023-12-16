const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
var router = express.Router();
const mongoose = require('mongoose');
const UploadAudio = require('../utils/schema')
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const {
  addEntitiy,
  getEntities,
  getEntitiesById,
  updateEntityById,
  getEntitiesByAttribute,
} = require("../utils/dynamo");

router.get('/market/items', async (req, res) => {
  try {
    // Use the Mongoose model to find all items in the collection
    const audioItems = await UploadAudio.find();

    // Respond with the retrieved items
    res.status(200).json({
      status: "Success",
      data: audioItems,
    });
  } catch (error) {
    console.error("Error retrieving uploaded audio:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
  
});

module.exports = router;