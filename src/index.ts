import { Browser, Page, launch } from 'puppeteer'
import { config } from './utils/config'
import { Logger } from './utils/logger';

(async () => {
    Logger.log(`STARTUP`, `Starting bloxflip-farmer`)

    const browser: Browser = await launch(
        {
            headless: config.debugging.headless,
            defaultViewport: null,
            args: [`--start-maximized`, `--no-sandbox`, `--disable-extensions`, `--profile-directory=Default`]
        }
    )

    const page: Page = (await browser.pages())[0]
    await page.setUserAgent(`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44`)
    await page.setExtraHTTPHeaders(
        {
            'x-auth-token': config.auth
        }
    )

    const authPage = await browser.newPage()

    await authPage.setRequestInterception(true);
    authPage.on("request", r => {
        r.respond({
            status: 200,
            contentType: "text/plain",
            body: config.auth
        });
    });

    await authPage.goto(`https://bloxflip.com/crash`)

    await authPage.evaluate(() => {
        const AuthToken = document.querySelector(`body`)?.textContent
        localStorage.setItem(`_DO_NOT_SHARE_BLOXFLIP_TOKEN`, AuthToken!)
    })
    await authPage.close()
    Logger.log(`AUTH`, `Auth token set to localStorage`)

    Logger.log(`PAGE`, `Waiting for network idle before starting, this might take a while depending on your internet.`)
    await page.goto(`https://bloxflip.com/crash`, { waitUntil: `networkidle2`, timeout: 60000 })

    const elementArr = [`button.button_button__eJwei.button_primary__mdLFG.gameBetSubmit`, `input.input_input__uGeT_.input_inputWithCurrency__sAiOQ`, `div.header_headerUserBalance__UEAJq`, `div.crash_crashGameCoefficient__M8rxs`, `input.input_input__uGeT_`]
    for (let element of elementArr) {
        if (!await page.$(element)) {
            Logger.error(`ELEMENTS`, `Unable to query the element: ${element}`)
        }
    }
    Logger.log(`ELEMENTS`, `Queried all elements.`)
    
    await page.evaluate(() => {
        const element = document.querySelectorAll(`button.button_button__eJwei.button_primary__mdLFG`)[0]
        if (element.textContent == `Log in`) {
            Logger.error(`AUTH`, `Invalid auth token`)
        }
    })

    const betMulti = (await page.$$(`input.input_input__uGeT_`))[1]
    betMulti.type(`2`)

    let joined, cashed, gameStarted = false
    let gameNumber: number = 0
    let lostStreak: number = 0

    async function bet(won: boolean) {
        let wallet = await page.$eval(`div.header_headerUserBalance__UEAJq`, element => element.textContent)
        const betBtn = await page.$(`button.button_button__eJwei.button_primary__mdLFG.gameBetSubmit`)
        const inputBox = await page.$(`input.input_input__uGeT_.input_inputWithCurrency__sAiOQ`)
        const prevBet = await inputBox?.evaluate(element => element.getAttribute(`value`))

        let bet: number
        if (won) {
            bet = parseFloat(wallet!) / Math.pow(2, config.tries)
        } else {
            let betBefore = await inputBox?.evaluate(element => element.getAttribute(`value`))
            bet = parseFloat(betBefore!) * 2
        }
        bet = Math.round((bet + Number.EPSILON) * 100) / 100

        async function sendBet() {
            await inputBox?.click({ clickCount: 3 })
            await inputBox?.press(`Backspace`)
            await inputBox?.type(bet.toString())

            let boxValue = await inputBox?.evaluate(element => element.getAttribute(`value`))
            if (boxValue == bet.toString()) {
                await sleep(1500)
                await betBtn?.click()
                await sleep(1000)

                wallet = await page.$eval(`div.header_headerUserBalance__UEAJq`, element => element.textContent)
                Logger.log(`BET`, `Game #${gameNumber} \nWin: ${won} \nBet: ${prevBet} \nLoss Streak: ${lostStreak} \nWallet: ${wallet} \n───────────────────────────`)
            } else {
                Logger.warn(`BET`, `Expected "${bet}" inside of bet input box but instead had "${boxValue}."`)
                await sendBet()
            }
        } await sendBet()
    }

    for (var i = 0; i < Infinity; i++) {
        await sleep(500);

        let gameStatus = await page.$(`div.crash_crashGameCoefficient__M8rxs`)
        let textContent = await gameStatus?.evaluate(element => {
            return element.textContent
        })

        if (textContent?.includes(`Waiting for EOS block to be mined...`)) {
            gameStarted = true
        }

        if (gameStarted) {
            let className = await gameStatus?.evaluate(element => {
                return element.className
            })

            if (className?.includes("isCrashed")) {
                if (joined) {
                    gameStarted = false
                    gameNumber++
                    lostStreak++
                    bet(false)
                } else {
                    Logger.log(`GAME`, `Ignoring this crash and resetting our bet.`)
                    joined = true
                    gameStarted = false
                    gameNumber++
                    bet(true)
                }
                await sleep(3000)
            }

            if (className?.includes("isCashed")) {
                if (!cashed) {
                    cashed = true
                    gameStarted = false
                    gameNumber++
                    lostStreak = 0
                    bet(true)
                    await sleep(3000)
                }
            } else {
                cashed = false
            }
        }
    }
})();

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}