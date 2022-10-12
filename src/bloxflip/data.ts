import { gameLoss, gameWon } from "./crash.js";
import { config } from "../utils/config.js";
import { sendWh } from "../utils/webhook.js";
import { Logger } from "../utils/logger.js";
import { get } from "../utils/pfetch.js";

let balanceBefore: number, betBefore: number;
async function getInfo(): Promise<void> {
    Logger.info("DATA", "\tStarting analysis module");

    const bfApi = await get("https://rest-bf.blox.land/user");

    balanceBefore = Math.round((bfApi.user.wallet + Number.EPSILON) * 100) / 100;
    betBefore = balanceBefore / Math.pow(2, config.tries);
    betBefore = Math.round((betBefore + Number.EPSILON) * 100) / 100;

    async function loop(): Promise<void> {
        new Promise((): void => {
            setTimeout(async () => {
                const bfApi = await get("https://rest-bf.blox.land/user");

                const balance: number = Math.round((bfApi.user.wallet + Number.EPSILON) * 100) / 100;
                let bet: number = balance / Math.pow(2, config.tries);
                bet = Math.round((bet + Number.EPSILON) * 100) / 100;

                function diffPercent(denominator: number, numerator: number): string {
                    const string = `${(denominator < numerator ? "-" + ((numerator - denominator) * 100) / denominator : ((denominator - numerator) * 100) / numerator)}`;
                    return Math.round((parseFloat(string) + Number.EPSILON) * 100) / 100 + "%";
                }

                function percentageOf(denominator: number, numerator: number): string {
                    return Math.round(((denominator / numerator * 100) + Number.EPSILON) * 100) / 100 + "%";
                }

                const gameCount = gameLoss + gameWon;
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
                                },
                                {
                                    "name": "Overall Game's",
                                    "value": `**Joined: ** ${gameWon + gameLoss} games\n**Won: ** ${gameWon} games (${percentageOf(gameWon, gameCount)})\n**Lost: ** ${gameLoss} games (${percentageOf(gameLoss, gameCount)})`,
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

                Logger.info("DATA", "\tSuccessfully calculated data for analysis.");
                await loop()
            }, 60 * 60000);
        });
    } if (config.webhook.modules.analytics) await loop();
}

export { getInfo, balanceBefore };
