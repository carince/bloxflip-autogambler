import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";

async function connectChatSocket(manager: any) {
    Logger.info("BF/CHAT", "Connecting to chat namespace...")

    const socket = manager.socket("/chat", {
        query: {
            auth: config.auth
        }
    }).open()

    socket.on('connect', () => {
        Logger.info("BF/CHAT", "Successfully connected to chat namespace.")
    })

    socket.on("rain-state-changed", (data: any) => {
        if (!data.active) return;
        if (data.prize < config.rain.minimum) {
            return Logger.log("RAIN", `Rain detected!\nNot notifying cause it does not meet minimum\nRobux: ${data.prize} R$\nHost: ${data.host}\nTime Remaining: ${data.duration / 60000} minute(s)`)
        }
        Logger.log("RAIN", `Rain detected!\nRobux: ${data.prize} R$\nHost: ${data.host}\nTime Remaining: ${data.duration / 60000} minute(s)`);
    })
}

export { connectChatSocket }