import { config } from "@utils/config.js";
import { sendWh } from "@utils/webhook.js";
import { Logger } from "@utils/logger.js";
import { get } from "@utils/pfetch.js";
import { sleep } from "@utils/sleep.js";

class dataAnalysis {
    public static async start() {
        if (!config.modules.analytics.enabled) return;

        Logger.info("DATA", "Starting analysis module");

        const bfApi = await get("https://rest-bf.blox.land/user");

        const balanceBefore = +bfApi.user.wallet.toFixed(2)
        let betBefore = balanceBefore / Math.pow(2, config.bet.tries);
        betBefore = +betBefore.toFixed(2)

        for (let i = 0; i < Infinity; i++) {
            new Promise(async (): Promise<void> => {
                await sleep(60 * 60000);
    
                const bfApi = await get("https://rest-bf.blox.land/user");

                const balance: number = +bfApi.user.wallet.toFixed(2)
                let bet: number = balance / Math.pow(2, config.bet.tries);
                bet = +bet.toFixed(2)
    
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
            });
        }
    }
}

export { dataAnalysis };
