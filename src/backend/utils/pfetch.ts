import { page } from "@utils/browser.js";
import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { sleep } from "@utils/sleep.js";
import { USER_AGENT } from "@utils/constants.js";

async function getBfUser<T>(): Promise<T | void> {
    const auth = config.auth;
    for (let i = 1; i < 6; i++) {
        const res: Record<string, unknown> & { apiError: any } = await page.evaluate(async (auth: string) => {
            let api;

            try {
                api = await fetch("https://rest-bf.blox.land/user", {
                    method: "get",
                    headers: {
                        "x-auth-token": auth
                    }
                });

                if (api.ok) {
                    return api.json();
                } else {
                    return { apiError: api.status };
                }
            } catch (e) {
                return { apiError: e };
            }
        }, auth);

        if (res.success) {
            return res as T;
        } else {
            Logger.error("PFETCH", `Fetching user data failed.\nError: ${res.error}`, true);
        }

        if (res.apiError) {
            Logger.warn("PFETCH", `Fetching user data failed, trying again... #${i} \nError: ${res.apiError} `);
            if (i === 4) return Logger.error("PFETCH", `Fetching user data failed. \nError: ${res.apiError}`, true);
            await sleep(5000);
        }
    }
}

async function sendWh(body: any) {
    if (!config.webhook.enabled) return;
    const link = config.webhook.link;

    const res: { apiError: any } | undefined = await page.evaluate(async (link: string, body: any) => {
        let api;

        console.log("im here");

        try {
            api = await fetch(link, {
                method: "post",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(body)
            });

            if (!api.ok) {
                return { apiError: api.status };
            }
        } catch (e) {
            return { apiError: e };
        }
    }, link, body);

    if (res?.apiError) {
        Logger.warn("PFETCH", `Sending webhook failed. \nError: ${res.apiError}`);
    }
}

async function getGh<T>(branch: string, hash: string): Promise<T | void> {
    for (let i = 1; i < 6; i++) {
        const res: { apiError: any } = await page.evaluate(async (branch: string, hash: string, USER_AGENT: string) => {
            let api;

            try {
                api = await fetch(`https://api.github.com/repos/carince/bloxflip-autocrash/compare/${hash}...${branch}`, {
                    method: "get",
                    headers: {
                        "User-Agent": USER_AGENT
                    }
                });

                if (api.ok) {
                    return api.json();
                } else {
                    return { apiError: api.status };
                }
            } catch (e) {
                return { apiError: e };
            }
        }, branch, hash, USER_AGENT);

        if (res.apiError) {
            Logger.warn("PFETCH", `Fetching GitHub changes failed, trying again... #${i} \nError: ${res.apiError} `);
            if (i === 4) return Logger.error("PFETCH", `Fetching GitHub changes failed. \nError: ${res.apiError}`, true);
            await sleep(5000);
        } else {
            return res as T;
        }
    }
}

export { getBfUser, sendWh, getGh };
