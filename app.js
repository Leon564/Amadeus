const express = require("express");
const app = express();
const api = require("./routes");
var path = require("path");
const request = require("request");
var bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get("/", function (req, res) {
  res.redirect("/api/phrase");
  //res.send("AMADEUS API");
});

app.use("/api", api);

app.get("*", function (req, res) {
  request(
    {
      url: config.page404,
      encoding: null,
    },
    (err, resp, buffer) => {
      if (!err && resp.statusCode === 200) {
        res.set("Content-Type", "image/jpeg");
        res.status(404).send(resp.body);
      }
    }
  );
});
module.exports = app;
