import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { fetchUserData, user } from "@bf/user.js";
import { socketDisconnectReasons } from "@utils/constants.js";

async function connectWalletSocket(manager: any) {
    const socket = manager.socket("/wallet").open();

    socket.on("connect", async () => {
        const res = await fetchUserData()
        const wallet = +(+res!.user.wallet.toFixed(2) + +res!.user.bonusWallet.toFixed(2)).toFixed(2);
        user.balance = wallet;

        Logger.info("SOCKET/WALLET", "Successfully connected to namespace.");
        socket.emit("auth", config.auth);
    });

    socket.on("disconnect", (reason: keyof typeof socketDisconnectReasons) => {
        Logger.error("SOCKET/WALLET", `Socket has disconnected, Reason: ${socketDisconnectReasons[reason]}`);
    });

    socket.on("update-wallet", (data: any) => {
        user.balance = +(user.balance + data).toFixed(2);
    });
}

export { connectWalletSocket };
