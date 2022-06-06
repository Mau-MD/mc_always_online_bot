import "dotenv/config";
import express from "express";
import mineflayer from "mineflayer";

// EXPRESS
const app = express();

const PORT = process.env.PORT || 3000;

// BOT

const host = process.env.MINECRAFT_HOST || "";
const username = process.env.MINECRAFT_USERNAME || "";
const port = process.env.MINECRAFT_PORT;

const botConfig = {
  host,
  username,
  port: port ? parseInt(port) : 25565,
};

const bot = mineflayer.createBot(botConfig);

bot.once("spawn", () => {
  setInterval(moveRandomly, 2000);

  let movementIndex = 0;

  function moveRandomly() {
    if (movementIndex % 2 === 0) bot.clearControlStates();

    switch (Math.floor(movementIndex / 2)) {
      case 0:
        bot.setControlState("forward", true);
        break;
      case 1:
        bot.setControlState("back", true);
        break;
      case 2:
        bot.setControlState("left", true);
        break;
      case 3:
        bot.setControlState("right", true);
        break;
    }
    movementIndex += 1;
    movementIndex = movementIndex % 8;
  }
});

bot.on("kicked", () => {
  bot.connect(botConfig);
});

bot.on("error", () => {
  bot.connect(botConfig);
});

bot.once("spawn", () => {
  console.log("Bot spawned!");
});
app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
