import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Logger } from "@utils/logger.js";

import { handleRain } from "@server/rain.js";
import { sendConfig } from "@server/user.js";
import { logBloxflip, handleLog } from "@server/logs.js";

let io: Server;

async function startServer() {
    const app = express();
    const server = http.createServer(app);
    io = new Server(server);

    app.use(express.json());

    server.listen(6580, "0.0.0.0", () => {
        Logger.info("SERVER", "Successfully started server, listening on port 6580.");
    });

    app.get("/", (_req, res) => {
        res.send("Welcome to bloxflip-autocrash! 🎉");
    });

    io.on("connection", (socket) => {
        Logger.info("SERVER", `${socket.id} has connected.`);

        socket.on("get-config", sendConfig);
        socket.on("new-game", Logger.logGame);
        socket.on("new-rain", handleRain);
        socket.on("new-log", handleLog);

        socket.on("bloxflip-ws-log", logBloxflip);

        socket.on("join-analytics", () => {
            socket.join("analytics");
        });
    });
}

export { startServer, io as socket };
