import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { user } from "@bf/user.js";

async function connectWalletSocket(manager: any) {
    const socket = manager.socket("/wallet").open();

    socket.on("connect", () => {
        Logger.info("SOCKET/WALLET", "Successfully connected to wallet namespace.");
        socket.emit("auth", config.auth);
    });

    socket.on("update-wallet", (data: any) => {
        user.balance = +(user.balance + data).toFixed(2);
    });
}

export { connectWalletSocket };
