const express = require("express");
const controller = require("./controller");
const {
  userProfileUpload,
  audioUpload,
  imageMsgFileUpload,
} = require("./helper"); // middleware

const router = express.Router();

// APIs
// second function are middlewares

router.post("/api/login", userProfileUpload, controller.userLogin);

router.get("/api/users-list/:id", controller.getUserList);

router.get("/api/user/:id", controller.getUserInfo);

router.post("/api/chats", controller.getUserChat);

router.get("/api/user/is-offline/:id", controller.checkUserOffline);

router.post("/api/upload-voice", audioUpload, controller.uploadVoice);

router.post(
  "/api/upload-image-file",
  imageMsgFileUpload,
  controller.uploadImageFile
);

module.exports = router;
