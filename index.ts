import "dotenv/config";
import express from "express";
import mineflayer from "mineflayer";

// EXPRESS
const app = express();

const PORT = process.env.PORT || 3000;

// BOT

let botNum = 1;

const host = process.env.MINECRAFT_HOST || "";
const username = process.env.MINECRAFT_USERNAME || "";
const port = process.env.MINECRAFT_PORT;

// VARS
const actions: Array<"forward" | "back" | "left" | "right"> = [
  "forward",
  "back",
  "left",
  "right",
];

let lastTime = -1;
let isMoving = false;
let isConnected = false;
let lastAction: typeof actions[number];

const moveInterval = 2;
const maxRandom = 5;

const botConfig = {
  host,
  username: username + botNum,
  port: port ? parseInt(port) : 25565,
};

let bot = mineflayer.createBot(botConfig);

bindEvents(bot);

const handleMovement = (bot: mineflayer.Bot) => {
  if (!isConnected) return;

  var randomaAdd = Math.random() * maxRandom * 20;
  var interval = moveInterval * 20 + randomaAdd;
  if (bot.time.age - lastTime > interval) {
    if (isMoving) {
      bot.setControlState(lastAction, false);
      isMoving = false;
      lastTime = bot.time.age;
    } else {
      var yaw = Math.random() * Math.PI - 0.5 * Math.PI;
      var pitch = Math.random() * Math.PI - 0.5 * Math.PI;
      bot.look(yaw, pitch, false);
      lastAction = actions[Math.floor(Math.random() * actions.length)];
      bot.setControlState(lastAction, true);
      isMoving = true;
      lastTime = bot.time.age;
      bot.activateItem();
    }
  }
};

function bindEvents(bot: mineflayer.Bot) {
  bot.once("spawn", () => {
    isConnected = true;
    lastTime = bot.time.age;
  });

  bot.on("time", () => {
    handleMovement(bot);
  });

  bot.on("error", (err) => {
    console.log("Error: " + err.message);
    isConnected = false;
    botNum += 1;
    setTimeout(relog, 5000);
  });

  bot.on("end", (a) => {
    isConnected = false;
    console.log("Bot has ended: " + a);
    botNum += 1;
    setTimeout(relog, 5000);
  });
}

function relog() {
  console.log("Attempting to reconnect...");
  bot = mineflayer.createBot(botConfig);
  bindEvents(bot);
}

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
