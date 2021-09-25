require("dotenv").config();
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const Routes = require("./app/routes");

const app = express();
const server = http.createServer(app);

const io = (module.exports.io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
})); // requiring and exporting in the same line
const socketManager = require("./app/socketManager/socketManager");

const port = process.env.PORT;
app.use(cors());
app.use([
  cors(),
  express.static("uploads"),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  Routes,
]);

io.on("connection", socketManager);

server.listen(port, () => {
  console.log("server is running on port " + port);
});
