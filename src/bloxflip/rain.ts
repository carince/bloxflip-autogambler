import { page } from "../index";
import { notify } from "node-notifier";
import { Logger } from "../utils/logger";

async function startRain() {
    Logger.info("RAIN", "\tStarting rain notifier.");

    let notified = false;
    async function start() {
        new Promise(() => {
            setTimeout(async () => {
                const res = await page.evaluate(async () => {
                    return fetch("https://rest-bf.blox.land/chat/history").then(res => res.json());
                });

                if (res.rain.active) {
                    if (!notified) {
                        notify({
                            title: "AutoCrash Rain Notifier",
                            message: `Robux: ${res.rain.prize} R$ \nHost: ${res.rain.host} \nTime Remaining: ${res.rain.duration / 60000} minute(s)`,
                            subtitle: "bloxflip-autocrash",
                            sound: true
                        });
    
                        notified = true;
                    }
                } else {
                    notified = false;
                }
                
                await start();
            }, 5000);
        });
    } await start();
}

export { startRain };
