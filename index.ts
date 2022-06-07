import "dotenv/config";
import express from "express";
import mineflayer from "mineflayer";
import { v4 as uuidv4 } from "uuid";

// EXPRESS
const app = express();

const PORT = process.env.PORT || 3001;

// BOT

const host = process.env.MINECRAFT_HOST || "";
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
  username: "vegeta" + uuidv4().substring(0, 8),
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
    console.log(`Connected with: ${bot.username}`);
    console.log("BOT SPAWNED");
    isConnected = true;
    lastTime = bot.time.age;
  });

  bot.on("time", () => {
    handleMovement(bot);
  });

  bot.on("error", (err) => {
    console.log("Error: " + err.message);
    isConnected = false;
    setTimeout(relog, 5000);
  });

  bot.on("end", (a) => {
    isConnected = false;
    console.log("Bot has ended: " + a);
    setTimeout(relog, 5000);
  });
}

function relog() {
  const newUsername = "vegeta" + uuidv4().substring(0, 8);
  console.log(`Attempting to reconnect with: ${newUsername}...`);
  bot = mineflayer.createBot({
    ...botConfig,
    username: newUsername,
  });
  bindEvents(bot);
}

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
