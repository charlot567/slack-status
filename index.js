const http = require("http");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { customFetch } = require("./utils");

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

app.route("/ping").get(async (req, res) => {
  try {
    const result = await customFetch(
      {
        channel: "CR0MR10J2",
        text: "Hello, world"
      },
      "chat.postMessage"
    );

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send("Pong");
});
app.route("/userStatus").post((req, res) => {
  console.log(req.body);
  res.status(200).send("Pong");
});

app.server.listen(8080, () => {
  console.log(`Server started on port ${app.server.address().port}`);
});

module.exports = app;
