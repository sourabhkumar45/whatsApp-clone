const { getUniqueId } = require("./helper");
const { getTime } = require("./helper");
const {
  userLogin,
  getUserList,
  getUserInfo,
  getUserChat,
} = require("./models/common.model");
const { getOfflineUserInfo } = require("./models/heartBeat.model");

// user login
exports.userLogin = async (req, res) => {
  try {
    const { name } = JSON.parse(req.body.payload);
    const cTime = getTime();
    // creating user
    let user = {
      name: name,
      profileImg: "",
      sessionId: getUniqueId(),
      createdAt: cTime,
      updatedAt: cTime,
    };
    if (req.file && req.file.filename) {
      user[
        "profileImg"
      ] = `${process.env.BASE_PATH}:${process.env.PORT}/${process.env.PROFILE_IMAGE_PATH}/${req.file.filename}`;
    }
    // storing the user in mongoDB
    let id = await userLogin(user);
    user["_id"] = id;
    res.status(200).send(user); // send custom message on HTTP 200 OK status
  } catch (ex) {
    console.log(ex);
    res.status(400).send(ex.message); // 400 Bad Request error
  }
};

// get user list
exports.getUserList = async (req, res) => {
  try {
    console.log("hitting this");
    const userList = await getUserList(req.params.id);
    let userListObj = {};
    if (userList.length) {
      for (let i = 0; i < userList.length; i++) {
        userListObj[userList[i].sessionId] = userList[i];
      }
    }
    res.status(200).send(userListObj); // send custom message on HTTP 200 OK status
  } catch (ex) {
    res.status(400).send(ex.message); // 400 Bad Request error
  }
};

//get user info
exports.getUserInfo = async (req, res) => {
  try {
    const userInfo = await getUserInfo(req.params.id);
    res.status(200).send(userInfo); // send custom message on HTTP 200 OK status
  } catch (ex) {
    res.status(400).send(ex.message); // 400 Bad Request error
  }
};

//user chat
exports.getUserChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body; // from frontend
    const chats = await getUserChat(senderId, receiverId);
    res.status(200).send(chats);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

// upload voice message
exports.uploadVoice = async (req, res) => {
  console.log(req);
  try {
    let filePath = "";
    if (req.file.filename) {
      filePath = `${process.env.BASE_PATH}:${process.env.PORT}/${process.env.AUDIO_PATH}/${req.file.filename}`;
    }
    res.status(200).send(filePath);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

//upload attachment
exports.uploadImageFile = async (req, res) => {
  try {
    let filePath = "";
    if (req.file.filename) {
      filePath = `${process.env.BASE_PATH}:${process.env.PORT}/${process.env.IMAGE_MSG_PATH}/${req.file.filename}`;
    }
    res.status(200).send(filePath);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

// checking for the user is offline or online
// creating a list in redis server ON and OFF, whenever user is Online add it to ON list and when
// offline add it to OFF list

exports.checkUserOffline = async (req, res) => {
  try {
    getOfflineUserInfo("WC:user:OFF", req.params.id, (error, response) => {
      if (error) {
        throw new Error("Some Error Occured");
      }
      res.status(200).send(response ? response : false);
    }); // set name and id
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};
