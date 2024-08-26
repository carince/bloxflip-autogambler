import handleLog from "@server/logs.js";
import { config } from "@utils/config.js";
import Logger from "@utils/logger.js";
import express from "express";
import http from "http";
// @ts-expect-error
import Server from "socket.io";

import handleRain from "./rain.js";

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

    io.on("connection", (socket: any) => {
        socket.on("get-config", (ack: (data: any) => unknown) => { ack(config); });
        socket.on("new-game", Logger.logGame);
        socket.on("new-rain", handleRain);
        socket.on("new-log", handleLog);
    });
}

export { io as socket, startServer };
