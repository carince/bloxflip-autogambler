
// @ts-ignore
import Server from "socket.io";
import express from "express";
import http from "http";

import { user } from "@bf/user.js";
import { analytics } from "@utils/analytics.js";
import { join } from "path";
import { __dirname } from "@utils/constants.js";

import { Logger } from "@utils/logger.js";
import { config } from "@utils/config.js";

let io: any;

async function startServer() {
    const app = express();
    const server = http.createServer(app);
    io = new Server(server);

    app.use(express.json());
    app.use("/public", express.static(join(__dirname, "pages", "public")));

    server.listen(6580, "0.0.0.0", () => {
        Logger.info("SERVER", "Successfully started analytics server, listening on port 6580.");
    });

    app.get("/", (req, res) => {
        res.sendFile(join(__dirname, "pages", "index.html"));
    });

    io.on("connection", (socket: any) => {
        Logger.info("SERVER/WS", `${socket.id} connected.`);
        socket.emit(
            "initialization",
            user,
            analytics.data,
            {
                bet: config.bet,
                rain: {
                    enabled: config.rain.enabled,
                    minimum: config.rain.minimum
                }
            }
        );
    });
}

export { startServer, io };
