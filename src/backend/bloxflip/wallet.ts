import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { user } from "@bf/user.js";
import { socketDisconnectReasons } from "@utils/constants.js";

async function connectWalletSocket(manager: any) {
    const socket = manager.socket("/wallet").open();

    socket.on("connect", () => {
        Logger.info("SOCKET/WALLET", "Successfully connected to namespace.");
        socket.emit("auth", config.auth);
    });

    socket.on("reconnecting", (attempt: number) => {
        Logger.warn("SOCKET/WALLET", `Attempting to reconnect to namespace, #${attempt}`)
    })

    socket.on("disconnect", (reason: keyof typeof socketDisconnectReasons) => {
        Logger.error("SOCKET/WALLET", `Socket has disconnected, Reason: ${socketDisconnectReasons[reason]}`)
    })

    socket.on("update-wallet", (data: any) => {
        user.balance = +(user.balance + data).toFixed(2);
    });
}

export { connectWalletSocket };
