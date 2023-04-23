import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { getBfUser, sendWh } from "@utils/pfetch.js";
import { sleep } from "@utils/sleep.js";

async function startDataAnalysis() {
    if (!config.modules.analytics.enabled) return;

    Logger.info("DATA", "Starting analysis module");

    const bfUser = await getBfUser();

    const balanceBefore = +bfUser!.user.wallet.toFixed(2);
    let betBefore = balanceBefore / Math.pow(2, config.bet.tries);
    betBefore = +betBefore.toFixed(2);

    async function start() {
        await sleep(60 * 60000);

        const bfUser = await getBfUser();

        const balance: number = +bfUser!.user.wallet.toFixed(2);
        let bet: number = balance / Math.pow(2, config.bet.tries);
        bet = +bet.toFixed(2);

        function diffPercent(denominator: number, numerator: number): string {
            const string = `${(denominator < numerator ? "-" + ((numerator - denominator) * 100) / denominator : ((denominator - numerator) * 100) / numerator)}`;
            return `${+parseFloat(string).toFixed(2)} + %`;
        }

        sendWh({
            "embeds": [
                {
                    "title": "Hourly Analysis",
                    "color": 3092790,
                    "fields": [
                        {
                            "name": "Balance",
                            "value": `**Before: ** ${balanceBefore}\n**After: ** ${balance}\n**Difference: ** ${diffPercent(balance, balanceBefore)}`,
                            "inline": true
                        },
                        {
                            "name": "Bet",
                            "value": `**Before: ** ${betBefore}\n**After: ** ${bet}\n**Difference: ** ${diffPercent(bet, betBefore)}`,
                            "inline": true
                        }
                    ],
                    "footer": {
                        "text": "bloxflip-autocrash"
                    },
                    "thumbnail": {
                        "url": "https://bloxflip.com/favicon.ico"
                    }
                }
            ]
        });

        Logger.info("DATA", "Successfully calculated data for analysis.");
        await start();
    }

    new Promise(start);
}

export { startDataAnalysis };
