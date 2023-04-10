import { page } from "../index.js";
import { config } from "./config.js";
import { Logger } from "./logger.js";
import { sleep } from "./sleep.js";

async function get(url: string): Promise<any> {
    const auth = config.auth;
    const api = await page.evaluate(async (auth: string, url: string) => {
        let api;
        try {
            api = await fetch(url, {
                method: "get",
                mode: "cors",
                credentials: "omit",
                headers: { "x-auth-token": auth },
            });

            if (api.status !== 200) {
                if (api.status == 403) {
                    return 1;
                } else {
                    return 2;
                }
            } else {
                return api.json();
            }
        } catch {
            return 2;
        }
    }, auth, url);

    if (api == 1) {
        return Logger.error("PFETCH", "Fetching failed, blocked by cloudflare.", true);
    }

    if (api == 2) {
        Logger.warn("PFETCH", "Fetching failed. trying again...");
        await sleep(1000);
        return await get(url);
    }

    return api;
}

async function post(url: string, body: string): Promise<any> {
    const api = await page.evaluate(async (url: string, body: string) => {
        let api;
        try {
            api = await fetch(url, {
                method: "post",
                credentials: "omit",
                mode: "cors",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: body
            });

            if (api.status !== 204) {
                if (api.status == 403) {
                    return 1;
                } else {
                    return 2;
                }
            }
        } catch {
            return 2;
        }
    }, url, body);

    if (api == 1) {
        return Logger.error("PFETCH", "Post failed, blocked by cloudflare.", true);
    }

    if (api == 2) {
        Logger.warn("PFETCH", "Post failed. trying again...");
        await sleep(5000);
        return await post(url, body);
    }
}

export { get, post };
