import { data } from "@bf/data.js";
import { config } from "@utils/config.js";

async function sendProfile(callback: (ack: any) => unknown) {
    callback(data.profile);
}

let times = 0;
function sendConfig(callback: (ack: any) => unknown) {
    times++;
    if (times > 1) return;
    callback(
        {
            auth: config.auth,
            bet: {
                tries: config.bet.tries,
                startingBet: config.bet.startingBet,
                autoCashout: config.bet.autoCashout
            },
            rain: {
                enabled: config.rain.enabled,
                minimum: config.rain.minimum
            }
        }
    );
}

export { sendConfig, sendProfile };
