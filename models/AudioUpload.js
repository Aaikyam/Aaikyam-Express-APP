const mongoose = require('mongoose');

const uploadAudioSchema = new mongoose.Schema(
  {
      music: {
          type: String,
      },
      title: {
          type: String,
      },
      tags: {
          type: [String],
      },
      genre: {
          type: String,
      },
      thumbnail: {
          type: String,
      },
      mainArtist: {
          type: String,
      },
      credits: {
          type: String,
      },
      listingPrice: {
          type: Number,
      },
      _isCopyrighted: {
          type: Boolean,
      },
      _containsMusic: {
          type: Boolean,
      },
      _isOnYt: {
          type: Boolean,
      },
      _ytUrls: {
          type: [String],
      },
      _isAssetized: {
          type: Boolean,
      },
  },
  { timestamps: true }
);


const UploadAudio = mongoose.model('UploadAudio', uploadAudioSchema, "Uploaded Audio");

module.exports = UploadAudio;
