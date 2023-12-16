const mongoose = require('mongoose');

const uploadAudioSchema = new mongoose.Schema({
  music: String,
  title: String,
  tags: [String],
  genre: String,
  thumbnail: String,
  mainArtist: String,
  credits: String,
  listingPrice: Number,
  _isCopyrighted: Boolean,
  _containsMusic: Boolean,
  _isOnYt: Boolean,
  _ytUrls: [String],
  _isAssetized: Boolean
});

const UploadAudio = mongoose.model('UploadAudio', uploadAudioSchema, "Uploaded Audio");

module.exports = UploadAudio;
