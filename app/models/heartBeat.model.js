const redisClient = require("./../config/redis");

exports.addUserToListRedis = (key, subKey, value, cb) => {
  // time is stored as a dummy value
  redisClient.HMSET(key, subKey, JSON.stringify(value), (error, res) => {
    return cb(error, res);
  });
};

exports.removeUserFromListRedis = (key, subKey) => {
  redisClient.HDEL(key, subKey);
};

exports.getOfflineUserInfo = (key, subKey, cb) => {
  // key = WC:user:OFF
  // subkey = sessionId
  redisClient.HGET(key, subKey, (error, res) => {
    cb(error, res);
  });
};
