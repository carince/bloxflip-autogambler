import { config } from "../utils/config.js"

async function rain(event: MessageEvent) {
    if (!config.rain.enabled) return;

    if (event.data.includes("42/crash,[\"rain-state-changed\"")) {
        const rainData = {
            active: event.data.match(/(?<="active":)(.*?)(?=,)/)[0],
            duration: event.data.match(/(?<="timeLeft":)(.*?)(?=,)/)[0],
            prize: event.data.match(/(?<="prize":)(.*?)(?=,)/)[0],
            host: event.data.match(/(?<="host":)(.*?)(?=,)/)[0]
        }

        if (rainData.active !== 'true') return;
        if (rainData.prize < config.rain.minimum) return;

        console.log(`[RAIN] Rain detected! \nRobux: ${rainData.prize} R$ \nHost: ${rainData.host} \nTime Remaining: ${rainData.duration / 60000} minute(s)`)
        fetch(`http://localhost:6580/rain`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rain: {
                    duration: rainData.duration,
                    prize: rainData.prize,
                    host: rainData.host
                }
            })
        })
    }
}

export { rain }