import { page } from "../index";
import { config } from "./config";
import { Logger } from "./logger";
import { sleep } from "./sleep";

async function get(url: string): Promise<any> {
    const auth = config.auth;
    const api = await page.evaluate(async (auth: string, url: string) => {
        let api;
        try {
            api = await fetch(url, {
                method: "get",
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
            return 3;
        }
    }, auth, url);

    if (api == 1) {
        return Logger.error("PFETCH", "Fetching failed, blocked by cloudflare.", true);
    }

    if (api == 2) {
        Logger.warn("PFETCH", "Fetching failed. trying again...");
        await sleep(500);
        return await get(url);
    }

    if (api == 1) {
        return Logger.error("PFETCH", "Fetching failed, unknown error.", true);
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
            return 3;
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

    if (api == 3) {
        // return Logger.error("PFETCH", "Post failed, unknown error.", true);
        return await sleep(60000);
    }
}

export { get, post };
