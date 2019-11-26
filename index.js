const http = require("http");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { customFetch } = require("./utils");
var CronJob = require("cron").CronJob;

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

new CronJob(
  "0 */20 * * * *",
  async function() {
    try {
      if (
        !(new Date().getHours() >= 8 + 5 && new Date().getHours() <= 18 + 5)
      ) {
        return;
      }

      const result = await customFetch(
        {
          channel: "DCW2Y6J7R", // User ID
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "Que fais tu?"
              }
            },
            {
              type: "actions",
              block_id: "actionblock789",
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Je suis/vais au gym!"
                  },
                  value: "gym"
                },
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Je code"
                  },
                  value: "coding"
                },
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Je suis en meeting"
                  },
                  value: "meeting"
                },
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Je suis en pause"
                  },
                  value: "pause"
                },
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Je fais autre choses"
                  },
                  value: "other"
                }
              ]
            }
          ]
        },
        "chat.postMessage"
      );
    } catch (error) {
      console.log(error);
    }
  },
  null,
  true,
  "America/Toronto"
);

app.route("/ping").get(async (req, res) => {
  try {
    const result = await customFetch(
      {
        channel: "DCW2Y6J7R", // User ID
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Que fais tu?"
            }
          },
          {
            type: "actions",
            block_id: "actionblock789",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Je suis/vais au gym!"
                },
                value: "gym"
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Je code"
                },
                value: "coding"
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Je suis en meeting"
                },
                value: "meeting"
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Je suis en pause"
                },
                value: "pause"
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Je mange"
                },
                value: "eat"
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Je fais autre choses"
                },
                value: "other"
              }
            ]
          }
        ]
      },
      "chat.postMessage"
    );

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send("Pong");
});

app.route("/userStatus").post(async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const userId = payload.user.id;
  const fileName = userId + ".txt";
  fs.appendFile(
    fileName,
    "\n" +
      payload.actions[0].value +
      ", " +
      new Date().getDay() +
      ", " +
      (new Date().getHours() - 5) +
      ":" +
      new Date().getMinutes(),
    // { flag: "wx" },
    function(err) {
      if (err) throw err;
      console.log("It's saved!");
    }
  );

  // Stocker dans une db, envoyer le questionnaire toute les heures
  res.status(200).send("Pong");
});

app.server.listen(8080, () => {
  console.log(`Server started on port ${app.server.address().port}`);
});

module.exports = app;
