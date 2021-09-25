const MONGO_DB = require("mongodb");
const MongoClient = MONGO_DB.MongoClient;

try {
  const M_CONNECT = MongoClient.connect(`${process.env.MONGO_URL}`, {
    useUnifiedTopology: true,
  });
  module.exports = { MONGO_DB, M_CONNECT };
} catch (ex) {
  console.log(ex);
}
