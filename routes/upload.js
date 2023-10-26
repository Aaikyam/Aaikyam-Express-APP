var express = require("express");
var router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");


const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const bucket = process.env.BUCKET_NAME;

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucket,
    acl: "public-read",
    metadata: function (req, file, cb) {
      console.log("check", file);
      cb(null, {
        field: file.fieldname,
        fileName: file.originalname,
        type: file.mimetype,
      });
    },
    key: function (req, file, cb) {
      cb(null, req.folder + Date.now().toString() + "-" + file.originalname);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (req.type === file.mimetype) {
      cb(null, true); 
    } else {
      cb(new Error("Invalid file type")); 
    }
  },
  limits: { fileSize: 10000000 },
});

//UPLOAD MUSIC
router.use("/upload/music", (req, res, next) => {
  req.folder = "music/"; 
  req.type = "audio/mpeg";
  next();
});
router.post("/upload/music", upload.single("file"), async (req, res) => {
  const uploadResult = req.file; 
  console.log("Uploaded file:", uploadResult);
  // res.setHeader("Content-Disposition", "inline; filename=" + uploadResult.key);

  const s3Url = uploadResult;
  res.status(200).send(s3Url.location);
});

//UPLOAD THUMBNAIL
router.use("/upload/thumbnail", (req, res, next) => {
  req.folder = "thumbnail/"; 
  req.type = "image/jpeg";
  next();
});
router.post("/upload/thumbnail", upload.single("file"), async (req, res) => {
  const uploadResult = req.file;
  console.log("Uploaded file:", uploadResult);
  // res.setHeader("Content-Disposition", "inline");

  const s3Url = uploadResult;
  res.status(200).send({"music_url":s3Url.location});
});

router.get("/test", (req, res) => {
  res.send("test");
});

module.exports = router;
