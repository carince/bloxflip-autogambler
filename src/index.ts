import { Browser, Page, launch } from 'puppeteer'
import { config } from './utils/config'
import { Logger } from './utils/logger';

let page: Page

(async () => {
    Logger.log(`STARTUP`, `Starting bloxflip-farmer`)

    Logger.info(`BROWSER`, `Launching browser...`)
    const browser: Browser = await launch(
        {
            headless: config.debugging.headless,
            defaultViewport: { width: 720, height: 1280, isMobile: true },
            args: [
                `--start-maximized`
            ]
        }
    )

    Logger.info(`BLOXFLIP`, `Parsing current page for Bloxflip`)
    page = (await browser.pages())[0]
    await page.setUserAgent(`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44`)
    await page.setExtraHTTPHeaders(
        {
            'x-auth-token': config.auth
        }
    )

    const authPage = await browser.newPage()
    await authPage.setRequestInterception(true);
    authPage.on(`request`, r => {
        r.respond({
            status: 200,
            contentType: `text/plain`,
            body: config.auth
        });
    });
    await authPage.goto(`https://bloxflip.com/crash`)
    await authPage.evaluate(() => {
        const AuthToken = document.querySelector(`body`)?.textContent
        localStorage.setItem(`_DO_NOT_SHARE_BLOXFLIP_TOKEN`, AuthToken!)
    })
    await authPage.close()
    Logger.info(`TOKEN`, `Successfully set token to localStorage`)

    Logger.info(`BLOXFLIP`, `Waiting for network idle...`)
    await page.goto(`https://bloxflip.com/crash`, { waitUntil: `networkidle0`, timeout: 60000 })

    const invalidToken = await page.evaluate(() => {
        const element = document.querySelectorAll(`button.button_button__eJwei.button_primary__mdLFG`)[0]
        if (element.textContent == `Log in`) {
            return true
        } else {
            return false
        }
    })

    if (invalidToken) {
        Logger.error(`TOKEN`, `Invalid token provided, please put a valid token into the config.`, true)
    }

    const elementArr = [`div.gameBlock.gameBet.crash_crashBet__D5Rs_ > button`, `input.input_input__uGeT_.input_inputWithCurrency__sAiOQ`, `div.header_headerUserBalance__UEAJq`, `div.crash_crashGameCoefficient__M8rxs`, `input.input_input__uGeT_`]
    for (let element of elementArr) {
        if (!await page.$(element)) {
            Logger.error(`ELEMENTS`, `Unable to query the element: ${element}`)
        }
    }
    Logger.info(`ELEMENTS`, `Queried all elements.`)

    const inputBox = await page.$(`input.input_input__uGeT_.input_inputWithCurrency__sAiOQ`)
    const betMulti = (await page.$$(`input.input_input__uGeT_`))[1]
    await betMulti.type(`2`)

    async function bet(won: boolean) {
        let bet: number
        const balance = await page.$eval(`div.header_headerUserBalance__UEAJq`, e => e.textContent)
        const prevBet = await inputBox?.evaluate(e => e.getAttribute(`value`))

        if (won) {
            bet = parseFloat(balance!) / Math.pow(2, config.tries)
            Logger.info(`BET`, `\tDividing balance to 2^${config.tries}`)
        } else {
            bet = parseFloat(prevBet!) * 2
            Logger.info(`BET`, `\tMultiplying previous bet to 2`)
        }

        bet = Math.round((bet + Number.EPSILON) * 100) / 100

        Logger.log(`BET`, `\tCalculated Bet: ${bet} R$, Balance: ${balance} R$`)

        await clear()
        async function clear() {
            await inputBox?.click({ clickCount: 3 })
            await inputBox?.press(`Backspace`)

            const currentValue = await inputBox?.evaluate(e => e.getAttribute(`value`))
            if (currentValue?.length) {
                Logger.warn(`BET`, `\tclear: Unable to clear inputBox, trying again...`)
                await sleep(500)
                await clear()
            }

            Logger.info(`CLEAR`, `Successfully cleared inputBox`)
        }

        await typeBet()
        async function typeBet() {
            await inputBox?.type(bet.toString())

            const currentValue = await inputBox?.evaluate(e => e.getAttribute(`value`))
            if (currentValue !== bet.toString()) {
                Logger.warn(`BET`, `\ttypeBet: Expected ${bet}, got ${currentValue} \nClearing the input box and trying again.`)
                await sleep(500)
                await clear()
                await typeBet()
            }

            Logger.info(`TYPEBET`, `Successfully typed bet into inputBox`)
        }

        await join()
        async function join() {
            let tries = 1

            await click()
            async function click() {
                if (tries <= 5) {
                    const betBtn = await page.$(`div.gameBlock.gameBet.crash_crashBet__D5Rs_ > button`)
                    let textContent = await betBtn?.evaluate(e => e.textContent)

                    if (textContent?.includes(`Join`)) {
                        await betBtn?.type(`\n`)
                        await sleep(3000)

                        let tries = 1
                        await check()
                        async function check() {
                            if (tries <= 5) {
                                textContent = await betBtn?.evaluate(e => e.textContent)
                                if (textContent == `Cashout` || `Cancel bet`) {
                                    Logger.log(`BET`, `\tSuccessfully joined game.`)
                                } else {
                                    Logger.warn(`BET`, `\tUnable to join game: ${textContent}, trying again...`)
                                    await sleep(1000)
                                }
                            } else {
                                Logger.error(`BET`, `\tUnable to join game after 5 tries.`)
                            }
                        }
                    } else {
                        if (textContent == `Cashout` || `Cancel bet`) {
                            Logger.warn(`BET`, `\tAlready joined this game, ignoring...`)
                        } else {
                            Logger.warn(`BET`, `\tBet button does not include 'Join': ${textContent}, trying again...`)
                            tries++
                            await sleep(1000)
                            await click()
                        }
                    }
                } else {
                    Logger.error(`BET`, `\tUnable to join game after 5 tries.`)
                }
            }
        }
    }

    await bet(true)

    let cashed = false
    let gameCount = 1
    let lossStreak = 0
    for (var i = 0; i < Infinity; i++) {
        const textContent = await page.$eval(`div.crash_crashGameCoefficient__M8rxs`, e => e.textContent)
        const className = await page.$eval(`div.crash_crashGameCoefficient__M8rxs`, e => e.className)

        if (textContent?.includes(`+`)) {
            if (className.includes(`isCrashed`)) {
                cashed = false
                gameCount++
                lossStreak++
                Logger.log(`CRASH`, `Status: Lost \n `)
                Logger.log(`GAME`, `\tGame #${gameCount}`)
                Logger.log(`GAME`, `\tLoss Streak: ${lossStreak}`)
                await sleep(3000)
                bet(false)
            }

            if (className.includes(`isCashed`)) {
                if (!cashed) {
                    cashed = true
                    gameCount++
                    lossStreak = 0
                    Logger.log(`CRASH`, `Status: Won \n `)
                    Logger.log(`GAME`, `\tGame #${gameCount}`)
                    await sleep(3000)
                    bet(true)
                }
            } else {
                cashed = false
            }
        } else {
            if (className.includes(`isCrashed`)) {
                Logger.warn(`CRASH`, `Havent joined this game, ignoring...`)
                if (lossStreak) {
                    Logger.warn(`CRASH`, `Continuing loss streak, getting wiped is possible.`)
                    await sleep(3000)
                    bet(false)
                } else {
                    await sleep(3000)
                    bet(true)
                }
            }
        }
    }
})();

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export { page }