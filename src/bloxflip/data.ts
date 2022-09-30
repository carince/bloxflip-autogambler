import { page } from '../index';
import { gameLoss, gameWon, gameCount } from './crash'
import { config } from '../utils/config'
import { sendWh } from '../utils/webhook'
import { Logger } from '../utils/logger';

let balanceBefore: number, betBefore: number
async function getInfo() {
    balanceBefore = await page.evaluate(async () => {
        return fetch(`https://rest-bf.blox.land/user`, {
            'headers': { 'x-auth-token': localStorage.getItem(`_DO_NOT_SHARE_BLOXFLIP_TOKEN`) || `` }
        }).then(res => res.json()).then(res => Math.round((res.user.wallet + Number.EPSILON) * 100) / 100)
    });

    betBefore = balanceBefore / Math.pow(2, config.tries);
    betBefore = Math.round((betBefore + Number.EPSILON) * 100) / 100

    async function loop() {
        new Promise(() => {
            setTimeout(async () => {
                compare()
                loop()
            }, 3600000);
        });
    } await loop()
}

async function compare() {
    const balance = await page.evaluate(async () => {
        return fetch(`https://rest-bf.blox.land/user`, {
            'headers': { 'x-auth-token': localStorage.getItem(`_DO_NOT_SHARE_BLOXFLIP_TOKEN`) || `` }
        }).then(res => res.json()).then(res => Math.round((res.user.wallet + Number.EPSILON) * 100) / 100)
    });

    let bet = balance / Math.pow(2, config.tries);
    bet = Math.round((bet + Number.EPSILON) * 100) / 100

    function diffPercent(denominator: number, numerator: number) {
        const string: string = `${(denominator < numerator ? `-` + ((numerator - denominator) * 100) / denominator : ((denominator - numerator) * 100) / numerator)}`
        return Math.round((parseFloat(string) + Number.EPSILON) * 100) / 100 + `%`;
    }

    function percentageOf(denominator: number, numerator: number) {
        return Math.round(((denominator / numerator * 100) + Number.EPSILON) * 100) / 100 + `%`
    }

    sendWh({
        'embeds': [
            {
                'title': 'Hourly Analysis',
                'color': 3092790,
                'fields': [
                    {
                        'name': 'Balance',
                        'value': `**Before: ** ${balanceBefore}\n**After: ** ${balance}\n**Difference: ** ${diffPercent(balance, balanceBefore)}`,
                        'inline': true
                    },
                    {
                        'name': 'Bet',
                        'value': `**Before: ** ${betBefore}\n**After: ** ${bet}\n**Difference: ** ${diffPercent(bet, betBefore)}`,
                        'inline': true
                    },
                    {
                        'name': `Overall Game's`,
                        'value': `**Won: ** ${gameWon} of ${gameCount} games (${percentageOf(gameWon, gameCount)})\n**Lost: ** ${gameLoss} of ${gameCount} games (${percentageOf(gameLoss, gameCount)})\n**Ratio: ** ${Math.round(gameWon / gameCount * 100)}/${Math.round(gameLoss / gameCount * 100)}`,
                        'inline': true
                    }
                ],
                'footer': {
                    'text': 'bloxflip-autocrash'
                },
                'thumbnail': {
                    'url': 'https://bloxflip.com/favicon.ico'
                }
            }
        ]
    })

    Logger.info(`DATA`, `\n Successfully calculated data for analysis.`)
}

export { getInfo }