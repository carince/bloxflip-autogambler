import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Logger } from "@utils/logger.js";
import { notifyRain } from "@api/rain.js";
import { logGame } from "@api/game.js";
import { log } from "@api/log.js";
import { __dirname } from "@utils/constants.js";
import { data } from "@bf/data.js";
import { join } from "path";

let socket: Server;

async function startApi() {
    const app = express();
    const server = http.createServer(app);
    socket = new Server(server);

    app.use(express.json());
    app.use("/public", express.static(join(__dirname, "pages", "public")));

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

    socket.on("connection", () => {
        socket.emit("games", data.games);
        socket.emit("rains", data.rains);
    });
}

export { startApi, socket };
