import express from "express";
import { Logger } from "@utils/logger.js";
import { notifyRain } from "@api/rain.js";
import { logGame } from "@api/game.js";

async function startApi() {
    const app = express();
    app.use(express.json());

    app.listen(6580, () => {
        Logger.info("API", "Successfully started Express server, listening on port 6580.");
    });

    app.get("/", (req, res) => {
        res.send("bloxflip-autocrash");
    });

    app.post("/rain", (req, res) => {
        notifyRain(req, res);
    });

    app.post("/game", (req, res) => {
        logGame(req, res);
    });
}

export { startApi };
