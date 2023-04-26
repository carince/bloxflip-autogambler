import { config } from "../utils/config.js";
import { post } from "../utils/api.js";
import { bfWs } from "../utils/ws.js";
import { Logger } from "../utils/logger.js";

async function startRain() {
    if (config.rain.enabled) {
        return bfWs.addEventListener("message", (event) => rain(event));
    }
}

async function rain(event: MessageEvent) {
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
            return Logger.log("RAIN", `Rain detected! \nNot notifying cause of set minimum \nRobux: ${rainData.prize} R$ \nHost: ${rainData.host} \nTime Remaining: ${rainData.duration / 60000} minute(s)`);
        }

        Logger.log("RAIN", `Rain detected! \nRobux: ${rainData.prize} R$ \nHost: ${rainData.host} \nTime Remaining: ${rainData.duration / 60000} minute(s)`);
        post("rain", {
            rain: {
                duration: rainData.duration,
                prize: rainData.prize,
                host: rainData.host
            }
        });
    }
}

export { startRain, rain };
