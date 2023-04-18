import { page } from "@utils/browser.js";
import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { sleep } from "@utils/sleep.js";

async function get(url: string): Promise<any> {
    const auth = config.auth;
    let tries = 0;

    async function api(): Promise<any> {
        tries++;
        const res = await page.evaluate(async (auth: string, url: string) => {
            let api;
            try {
                api = await fetch(url, {
                    method: "get",
                    mode: "cors",
                    credentials: "omit",
                    headers: { "x-auth-token": auth },
                });
            } catch (err) {
                return { apiError: err };
            }

            if (!api.ok) return { apiError: api.status };
            return api.json();
        }, auth, url);

        if (res.apiError) {
            Logger.warn("PFETCH", `Fetching failed, trying again... \nError: ${JSON.stringify(res)} \nLink: ${url}`);
            await sleep(2000);
            if (tries === 5) return Logger.error("PFETCH", `Fetching failed, \nError: ${JSON.stringify(res)} \nLink: ${url}`, true);
            return await api();
        } else {
            return res;
        }
    }

    return await api();
}

async function post(url: string, body: string): Promise<any> {
    let tries = 0;

    async function api(): Promise<any> {
        tries++;
        const res = await page.evaluate(async (url: string, body: string) => {
            let api;
            try {
                api = await fetch(url, {
                    method: "post",
                    credentials: "omit",
                    mode: "cors",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: body
                });
            } catch (err) {
                return { apiError: err };
            }

            if (!api.ok) return { apiError: api.status };
        }, url, body);

        if (res?.apiError) {
            Logger.warn("PFETCH", `Posting failed, trying again... \nCode: ${JSON.stringify(res)} \nLink: ${url}`);
            await sleep(2000);
            if (tries === 5) return Logger.error("PFETCH", `Posting failed. \nCode: ${JSON.stringify(res)} \nLink: ${url}`);
            await api();
        }
    }

    return await api();
}

export { get, post };
