import { Browser, Page, launch } from 'puppeteer';
import { config } from './config';
import { Logger } from './logger';

let page: Page;

async function initialize() {
    await sleep(1000)

    const browser: Browser = await launch(
        {
            headless: config.debugging.headless,
            defaultViewport: { width: 1920, height: 1080 },
            args: [
                `--start-maximized`
            ]
        }
    );

    Logger.info(`BLOXFLIP`, `Parsing current page for Bloxflip`);
    page = (await browser.pages())[0];
    await page.setUserAgent(`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44`);
    await page.setExtraHTTPHeaders(
        {
            'x-auth-token': config.auth
        }
    );

    const authPage = await browser.newPage();
    await authPage.setRequestInterception(true);
    authPage.on(`request`, r => {
        r.respond({
            status: 200,
            contentType: `text/plain`,
            body: config.auth
        });
    });
    await authPage.goto(`https://bloxflip.com/crash`);
    await authPage.evaluate(() => {
        const AuthToken = document.querySelector(`body`)?.textContent;
        localStorage.setItem(`_DO_NOT_SHARE_BLOXFLIP_TOKEN`, AuthToken!);
    });
    await authPage.close();
    Logger.info(`TOKEN`, `Successfully set token to localStorage`);

    Logger.info(`BLOXFLIP`, `Waiting for network idle...`);
    await page.goto(`https://bloxflip.com/crash`, { timeout: 60000 });

    return page;
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export { initialize };
