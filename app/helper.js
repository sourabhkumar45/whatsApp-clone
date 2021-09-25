const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// uid for sessionId
exports.getUniqueId = () => {
  return uuidv4();
};

exports.getTime = () => {
  return Date.now();
};

// middleware of profile image upload
const userProfileStorage = multer.diskStorage({
  destination: `uploads/${process.env.PROFILE_IMAGE_PATH}/`,
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

exports.userProfileUpload = multer({
  storage: userProfileStorage,
  limits: { fileSize: 10000000 },
}).single("profileImg");

// middleware of audio message upload
const audioStorage = multer.diskStorage({
  destination: `uploads/${process.env.AUDIO_PATH}/`,
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".webm");
  },
});

exports.audioUpload = multer({
  storage: audioStorage,
  limits: { fileSize: 1000000 },
}).single("track");

// middleware of message image upload
const imageMsgFileStorage = multer.diskStorage({
  destination: `uploads/${process.env.IMAGE_MSG_PATH}/`,
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

exports.imageMsgFileUpload = multer({
  storage: imageMsgFileStorage,
  limits: { fileSize: 1000000 },
}).single("imageMsg");
