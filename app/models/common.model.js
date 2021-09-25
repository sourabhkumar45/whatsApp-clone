const { MONGO_DB, M_CONNECT } = require("./../config/mongoDB");

//user login
exports.userLogin = async (payload) => {
  const db = (await M_CONNECT).db(process.env.MONGO_DB_NAME);
  let collection = await db.collection(process.env.MONGO_DB_USERS_COLLECTION);
  let res = await collection.insertOne(payload);
  return res.insertedId;
};

// get all users from DB
exports.getUserList = async (sessionId) => {
  const db = (await M_CONNECT).db(process.env.MONGO_DB_NAME);
  let collection = await db.collection(process.env.MONGO_DB_USERS_COLLECTION);
  let res = await collection.find({ sessionId: { $ne: sessionId } }).toArray();
  return res;
};

//get user info
exports.getUserInfo = async (sessionId) => {
  const db = (await M_CONNECT).db(process.env.MONGO_DB_NAME);
  let collection = await db.collection(process.env.MONGO_DB_USERS_COLLECTION);
  let res = await collection.findOne({ sessionId: sessionId });
  return res;
};

// chats
exports.getUserChat = async (senderId, receiverId) => {
  const db = (await M_CONNECT).db(process.env.MONGO_DB_NAME);
  let collection = await db.collection(process.env.MONGO_DB_CHATS_COLLECTION);
  let res = await collection
    .find({ room: { $all: [senderId, receiverId] } })
    .toArray();
  return res;
};

exports.saveChat = async (payload) => {
  const db = (await M_CONNECT).db(process.env.MONGO_DB_NAME);
  let collection = await db.collection(process.env.MONGO_DB_CHATS_COLLECTION);
  let res = await collection.insertOne(payload);
  return res.insertedId;
};
