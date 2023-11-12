import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Logger } from "@utils/logger.js";
import { __dirname } from "@utils/constants.js";
import { join } from "path";

import { sendGames, handleGame } from "@server/crash.js";
import { sendRains, handleRain } from "@server/rain.js";
import { sendConfig, sendProfile } from "@server/user.js";
import { logBloxflip, handleLog } from "@server/logs.js";

let io: Server;

async function startServer() {
    const app = express();
    const server = http.createServer(app);
    io = new Server(server);

    app.use(express.json());
    app.use("/public", express.static(join(__dirname, "pages", "public")));

    server.listen(6580, "0.0.0.0", () => {
        Logger.info("SERVER", "Successfully started server, listening on port 6580.");
    });

    app.get("/", (req, res) => {
        res.send("Welcome to bloxflip-autocrash! 🎉 <br>If you are looking for the analytics page, go to: http://localhost:6580/analytics");
    });

    app.get("/analytics", (req, res) => {
        res.sendFile(join(__dirname, "pages", "index.html"));
    });

    io.on("connection", (socket) => {
        Logger.info("SERVER", `${socket.id} has connected.`);

        socket.on("get-games", sendGames);
        socket.on("get-rains", sendRains);
        socket.on("get-config", sendConfig);
        socket.on("get-profile", sendProfile);
        socket.on("new-game", handleGame);
        socket.on("new-rain", handleRain);
        socket.on("new-log", handleLog);

        socket.on("bloxflip-ws-log", logBloxflip);

        socket.on("join-analytics", () => {
            socket.join("analytics");
        });
    });
}

export { startServer, io as socket };
