import { page } from "../index";
import { notify } from "node-notifier";
import { Logger } from "../utils/logger";

async function startRain() {
    Logger.info("RAIN", "\tStarting rain notifier.");

    let notified = false;
    await start();
    async function start() {
        new Promise(() => {
            setTimeout(async () => {
                try {
                    if (!notified) {
                        const rain = await page.$eval("div.chat_chatBanner__A7TqO", e => e.textContent);
                        const robux = rain!.split("!").pop()!.split("  ")[0];
                        const host = rain!.split("by ").pop()!.split("Join For Free")[0];

                        notify({
                            title: "Bloxflip Rain Notifier",
                            message: `Robux: ${robux} R$, Host: ${host}`,
                            subtitle: "bloxflip-autocrash",
                            sound: true
                        });

                        notified = true;
                    }
                } catch (err) {
                    notified = false;
                }

                await start();
            }, 5000);
        });
    }
}

export { startRain };
