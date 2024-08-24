import { user } from "@bf/user.js";
import { config } from "@utils/config.js";
import { socketDisconnectReasons } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import formatNum from "@utils/number.js";
import { Manager, Socket } from "socket.io-client";

export let socket: Socket;

export default async function connect(manager: Manager) {
    socket = manager.socket("/wallet").open();

    socket.on("connect", async () => {
        Logger.info("SOCKET/WALLET", "Successfully connected to namespace.");
        socket.emit("auth", config.auth);
    });

    socket.on("disconnect", async (reason: keyof typeof socketDisconnectReasons) => {
        Logger.error("SOCKET/WALLET", `Socket has disconnected, Reason: ${socketDisconnectReasons[reason]}`);
    });

    socket.on("update-wallet", (data: number) => {
        user.balance = formatNum(user.balance + data);
    });
}
