// eslint-disable-next-line
import io, { Socket } from "socket.io-client/dist/socket.io.dev.js";

import Logger from "./logger.js";

let serverWs: Socket;

async function connectServerWs() {
    serverWs = await io("http://localhost:6580", {
        transports: ["websocket"],
    });

    serverWs.on("connect", async () => {
        Logger.info("SERVER", `Successfully connected to server with ID: ${serverWs.id}`);
    });
}

export {
    connectServerWs, serverWs,
};
