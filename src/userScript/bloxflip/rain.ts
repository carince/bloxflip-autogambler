import { config } from "../utils/config.js";
import { serverWs } from "../utils/ws.js";
import { Logger } from "../utils/logger.js";
import { game } from "./crash.js";

async function rain(event: MessageEvent) {
    if (event.data.includes("42/chat,[\"notify-success\",\"Make sure to thank")) {
        const rainBalance = event.data.match(/\d+\.\d+/)[0];
        const rainHost = event.data.match(/\b[A-Za-z0-9_]+\b(?=\sfor hosting)/)[0];
        game.balance = game.balance + parseFloat(rainBalance);
        game.balance = +game.balance.toFixed(2);
        Logger.log("RAIN", `Rain Concluded! \nRobux Collected: ${rainBalance} R$ \nBalance: ${game.balance} \nHost: ${rainHost}`)
    }

    if (!config.rain.enabled) return;

    if (event.data.includes("42/chat,[\"rain-state-changed\"")) {
        const rainData = {
            active: event.data.match(/(?<="active":)(.*?)(?=,)/)[0],
            duration: event.data.match(/(?<="timeLeft":)(.*?)(?=,)/)[0],
            prize: event.data.match(/(?<="prize":)(.*?)(?=,)/)[0],
            host: event.data.match(/(?<="host":")(.*?)(?=",)/)[0]
        };

        if (rainData.active !== "true") return;
        if (rainData.prize < config.rain.minimum) {
            return Logger.log("RAIN", `Rain detected! \nNot notifying cause of set minimum \nRobux: ${rainData.prize} R$ \nHost: ${rainData.host} \nTime Remaining: ${rainData.duration / 60000} minute(s)`, { skipEmit: true });
        }

        Logger.log("RAIN", `Rain detected! \nRobux: ${rainData.prize} R$ \nHost: ${rainData.host} \nTime Remaining: ${rainData.duration / 60000} minute(s)`, { skipEmit: true });

        serverWs.emit("new-rain", {
            duration: rainData.duration,
            prize: rainData.prize,
            host: rainData.host
        });
    }
}

export { rain };
