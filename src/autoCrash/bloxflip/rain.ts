import { config } from "../utils/config.js"

async function rain(event: MessageEvent) {
    if (!config.rain.enabled) return;

    if (event.data.includes("42/crash,[\"rain-state-changed\"")) {
        const rainData = {
            active: event.data.match(/(?<="active":)(.*?)(?=,)/)[0],
            timeLeft: event.data.match(/(?<="timeLeft":)(.*?)(?=,)/)[0],
            prize: event.data.match(/(?<="prize":)(.*?)(?=,)/)[0],
            host: event.data.match(/(?<="host":)(.*?)(?=,)/)[0]
        }

        if (rainData.active === 'true') {
            if (rainData.prize < config.rain.minimum ) return;
            console.log(`[RAIN] Rain detected! \nRobux: ${rainData.prize} R$ \nHost: ${rainData.host} \nTime Remaining: ${rainData.timeLeft / 60000} minute(s)`)
        }
    }
}

export { rain }