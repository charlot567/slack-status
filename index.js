const http = require("http");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.server = http.createServer(app);

app.use(morgan("dev"));
app.enable("trust proxy");

const originsAllowed = (() => {
  return ["http://localhost:3000"];
})();

app.options(
  "*",
  cors({
    origin: (origin, callback) => {
      if (originsAllowed.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  bodyParser.json({
    limit: "1mb"
  })
);
app.use((req, res, next) => {
  if (originsAllowed.includes(req.headers.origin)) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.disable("x-powered-by");

app.route("/ping").post((req, res) => {
  res.status(200).send("Pong");
});

app.server.listen(8080, () => {
  console.log(`Server started on port ${app.server.address().port}`);
});

module.exports = app;
