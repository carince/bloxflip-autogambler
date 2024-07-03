import { user } from "@bf/user.js";
import { config } from "@utils/config.js";
import { socketDisconnectReasons } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import formatNum from "@utils/number.js";

export default async function connect(manager: any) {
    const socket = manager.socket("/wallet").open();

    socket.on("connect", async () => {
        Logger.info("SOCKET/WALLET", "Successfully connected to namespace.");
        socket.emit("auth", config.auth);
    });

    socket.on("disconnect", (reason: keyof typeof socketDisconnectReasons) => {
        Logger.error("SOCKET/WALLET", `Socket has disconnected, Reason: ${socketDisconnectReasons[reason]}`);
    });

    socket.on("update-wallet", (data: any) => {
        user.balance = formatNum(user.balance + data);
    });
}
