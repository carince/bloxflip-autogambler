/* eslint-disable no-console */
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { join } from "path";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

puppeteer.default.use(stealthPlugin());
const pathToExtension = join(__dirname, "..", "lib", "nopecha");
const pup = await puppeteer.default.launch(
    {
        headless: false,
        devtools: true,
        args: [
            "--start-maximized",
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
    },
);

const [page] = await pup.pages();
await page.goto("https://2captcha.com/demo/hcaptcha?difficulty=moderate", { timeout: 0 });

console.log("Loaded captcha demo");

page.on("response", async (response) => {
    if (response.url().includes("api.hcaptcha.com/checkcaptcha")) {
        console.log("Captcha results received");
        console.log(response.request().method().toUpperCase());
        if (response.request().method().toUpperCase() === "OPTIONS") return;
        console.log(await response.json());
    }
});
