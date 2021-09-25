const io = require("./../../server").io;
const { getTime } = require("./../helper");
const {
  addUserToListRedis,
  removeUserFromListRedis,
} = require("./../models/heartBeat.model");

const { saveChat } = require("./../models/common.model");

module.exports = (socket) => {
  try {
    console.log("socket.io backend connected");
    socket.on("join-user", (data, callback) => {
      const { createdAt, name, profileImg, sessionId, updatedAt, _id } = data;
      const cTime = getTime();
      const newUser = {
        createdAt,
        name,
        profileImg,
        sessionId,
        updatedAt: cTime,
        _id,
      };
      // delete user from WC:user:OFF and user to WC:user:On list
      removeUserFromListRedis("WC:user:OFF", sessionId);
      addUserToListRedis(`WC:user:ON`, sessionId, { time: cTime }, (e, r) => {
        if (e) return callback(e);
        console.log("new user joined", r);
        socket.sessionId = sessionId;
        socket.join(sessionId);
        socket.broadcast.emit("new-online-user", newUser);
        callback();
      });
    });

    socket.on("send-msg", async (data, callback) => {
      const { senderId, receiverId, msg } = data;
      // store message to mongo
      const chatObj = {
        room: [senderId, receiverId],
        senderId,
        receiverId,
        msg,
        time: getTime(),
      };
      await saveChat(chatObj);
      io.to(receiverId).emit("receive-msg", chatObj);
      callback(chatObj);
    });
    socket.on("user-typing", async (data, callback) => {
      const { senderId, receiverId, msg } = data;
      const chatObj = {
        room: [senderId, receiverId],
        senderId,
        receiverId,
        msg,
        time: getTime(),
      };
      io.to(receiverId).emit("user-typing", chatObj);
      callback(data);
    });
    socket.on("disconnect", () => {
      const { sessionId } = socket;
      if (sessionId) {
        removeUserFromListRedis("WC:user:ON", sessionId);
        const offlineUser = {
          time: getTime(),
          sessionId,
        };
        addUserToListRedis("WC:user:OFF", sessionId, offlineUser, (e, r) => {
          console.log("user left", r);
        });
        socket.broadcast.emit("new-offline-user", offlineUser);
      }
    });
  } catch (ex) {
    console.log(ex);
  }
};
