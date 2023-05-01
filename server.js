const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");
const path = require("path");
const Rollbar = require("rollbar");

const rollbar = new Rollbar({
  accessToken: "ac2902e427ac436da6f73c1cc9dc6a6f",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const playerRecord = {
  wins: 0,
  losses: 0,
};

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(rollbar.errorHandler());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(bots);
  } catch (error) {
    rollbar.error(error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    const shuffled = shuffle(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    rollbar.error(error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      rollbar.info("Player lost.");
      res.status(200).send("You lost!");
    } else {
      playerRecord.wins += 1;
      rollbar.info("Player won!");
      res.status(200).send("You won!");
    }
  } catch (error) {
    rollbar.error(error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    rollbar.error(error);
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
