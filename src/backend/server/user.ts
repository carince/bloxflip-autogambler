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
                startingBet: config.bet.starting_bet,
                autoCashout: config.bet.auto_cashout
            },
            rain: {
                enabled: config.rain.enabled,
                minimum: config.rain.minimum
            }
        }
    );
}

export { sendConfig, sendProfile };
