import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Logger } from "@utils/logger.js";
import { notifyRain } from "@api/rain.js";
import { logGame } from "@api/game.js";
import { log } from "@api/log.js";
import { sendData } from "@api/data.js";
import { __dirname } from "@utils/constants.js";
import { join } from "path";

async function startApi() {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    app.use(express.json());
    app.use(express.static(join(__dirname, "pages", "public")));

    server.listen(6580, "0.0.0.0", () => {
        Logger.info("API", "Successfully started Express server, listening on port 6580.");
    });

    app.get("/", (req, res) => {
        Logger.info("API", `${req.hostname} made request to API.`);
        res.sendFile(join(__dirname, "pages", "index.html"));
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

    app.get("/data", (req, res) => {
        sendData(req, res);
    });

    io.on("connection", (socket) => {
        Logger.log("WS", "A user connected");
        socket.on("disconnect", () => {
            Logger.log("WS", "A  user disconnected");
        });
    });
}

export { startApi };
