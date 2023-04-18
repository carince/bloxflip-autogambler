import express from "express";
import { Logger } from "@utils/logger.js";
import { notifyRain } from "@api/rain.js";
import { logGame } from "@api/game.js";
import { log } from "@api/log.js";

async function startApi() {
    const app = express();
    app.use(express.json());

    app.listen(6580, () => {
        Logger.info("API", "Successfully started Express server, listening on port 6580.");
    });

    app.get("/", (req, res) => {
        Logger.info("API",`${req.hostname} made request to API.`);
        res.send("bloxflip-autocrash");
    });

    app.post("/rain", (req, res) => {
        notifyRain(req, res);
    });

    app.post("/game", (req, res) => {
        logGame(req, res);
    });

    app.post("/log/:type", (req, res) => {
        log(req, res);
    });
}

export { startApi };
