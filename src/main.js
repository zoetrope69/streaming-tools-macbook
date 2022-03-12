import "dotenv/config";

import fetch from "node-fetch";
import express from "express";

import getIpAddress from "./get-ip-address.js";
import Ableton from "./ableton.js";

const { MAIN_SERVER_URL, PORT, MACBOOK_SECRET } = process.env;

if (!MAIN_SERVER_URL || !PORT || !MACBOOK_SECRET) {
  throw new Error("Missing environment variabes.");
}

const ipAddress = getIpAddress();
const host = `http://${ipAddress}:${PORT}`;

function pingMainServer() {
  console.log("Pinging main server..."); // eslint-disable-line no-console
  sendDataToMainServer("ping", { host });
}
pingMainServer();
setInterval(pingMainServer, 10000); // then ping every 10 secs

const app = express();

app.use(express.json());

const ableton = new Ableton({ app });

ableton.on("change", (data) => sendDataToMainServer("ableton", data));

async function sendDataToMainServer(eventType, data) {
  console.log(`[${eventType}] ${JSON.stringify(data)}`); // eslint-disable-line no-console
  console.log(`${MAIN_SERVER_URL}/macbook/${eventType}`);
  try {
    await fetch(`${MAIN_SERVER_URL}/macbook/${eventType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        secret: MACBOOK_SECRET,
      }),
    });
  } catch (e) {
    console.error(e.message); // eslint-disable-line no-console
  }
}

app.listen(PORT, () => {
  console.info(`Listening on http://localhost:${PORT}`);
});
