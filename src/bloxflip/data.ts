import { curly as curl } from "node-libcurl";
import { gameLoss, gameWon, gameCount } from "./crash";
import { config } from "../utils/config";
import { sendWh } from "../utils/webhook";
import { Logger } from "../utils/logger";

let balanceBefore: number, betBefore: number;
async function getInfo() {
    Logger.info("DATA", "\tStarting analysis module");

    const bfApi = await curl.get("https://rest-bf.blox.land/user",
        {
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44",
            sslVerifyPeer: false,
            httpHeader: [`x-auth-token: ${config.auth}`]
        }
    );

    if (bfApi.statusCode !== 200) {
        Logger.warn("DATA", `\nFetching user info failed, possibly blocked by cloudflare. Code: ${bfApi.statusCode}`);
        return;
    } else {
        balanceBefore = Math.round((bfApi.data.user.wallet + Number.EPSILON) * 100) / 100;
    }

    betBefore = balanceBefore / Math.pow(2, config.tries);
    betBefore = Math.round((betBefore + Number.EPSILON) * 100) / 100;

    async function loop() {
        new Promise(() => {
            setTimeout(async () => {
                compare();
                loop();
            }, 3600000);
        });
    } await loop();
}

async function compare() {
    const balance = await curl.get("https://rest-bf.blox.land/user",
        {
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44",
            sslVerifyPeer: false,
            httpHeader: [`x-auth-token: ${config.auth}`]
        }
    ).then(res => Math.round((res.data.user.wallet + Number.EPSILON) * 100) / 100);

    let bet = balance / Math.pow(2, config.tries);
    bet = Math.round((bet + Number.EPSILON) * 100) / 100;

    function diffPercent(denominator: number, numerator: number) {
        const string = `${(denominator < numerator ? "-" + ((numerator - denominator) * 100) / denominator : ((denominator - numerator) * 100) / numerator)}`;
        return Math.round((parseFloat(string) + Number.EPSILON) * 100) / 100 + "%";
    }

    function percentageOf(denominator: number, numerator: number) {
        return Math.round(((denominator / numerator * 100) + Number.EPSILON) * 100) / 100 + "%";
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
                    },
                    {
                        "name": "Overall Game's",
                        "value": `**Won: ** ${gameWon} of ${gameCount} games (${percentageOf(gameWon, gameCount)})\n**Lost: ** ${gameLoss} of ${gameCount} games (${percentageOf(gameLoss, gameCount)})\n**Ratio: ** ${Math.round(gameWon / gameCount * 100)}/${Math.round(gameLoss / gameCount * 100)}`,
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

    Logger.info("DATA", "\n Successfully calculated data for analysis.");
}

export { getInfo };
