const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
var router = express.Router();
const mongoose = require('mongoose');
const UploadAudio = require('../models/schema')
const Razorpay = require('razorpay');
const {addEntitiy, getEntities, getEntitiesById, updateEntityById, getEntitiesByAttribute,} = require("../utils/dynamo");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var instance = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});


const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

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

router.get('market/:item', async(req,res)=>{
  try {
    const itemId = req.params.id;
    const audioItem = await UploadAudio.findById(itemId);

    if (!audioItem) {
      return res.status(404).json({
        status: "Not Found",
        message: "Audio item not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: audioItem,
    });
  } catch (error) {
    console.error("Error retrieving uploaded audio by ID:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post('/market/create-order', async (req, res) => {
  try {
    const receiptId = generateRandomString(12); 

    var options = {
      amount: req.body.amount,
      currency: req.body.currency,
      receipt: `order_rcptid_${receiptId}`, 
    };
    instance.orders.create(options, function (err, order) {
      res.status(200).json({
        status: "Success",
        data: order,
      });
    });

  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});


module.exports = router;