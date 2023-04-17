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

        let balanceBefore = Math.round((bfApi.user.wallet + Number.EPSILON) * 100) / 100;
        let betBefore = balanceBefore / Math.pow(2, config.tries);
        betBefore = Math.round((betBefore + Number.EPSILON) * 100) / 100;

        for (let i = 0; i < Infinity; i++) {
            new Promise(async (): Promise<void> => {
                await sleep(60 * 60000);
    
                const bfApi = await get("https://rest-bf.blox.land/user");
    
                const balance: number = Math.round((bfApi.user.wallet + Number.EPSILON) * 100) / 100;
                let bet: number = balance / Math.pow(2, config.tries);
                bet = Math.round((bet + Number.EPSILON) * 100) / 100;
    
                function diffPercent(denominator: number, numerator: number): string {
                    const string = `${(denominator < numerator ? "-" + ((numerator - denominator) * 100) / denominator : ((denominator - numerator) * 100) / numerator)}`;
                    return Math.round((parseFloat(string) + Number.EPSILON) * 100) / 100 + "%";
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
