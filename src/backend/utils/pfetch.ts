import { page } from "@utils/browser.js";
import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { sleep } from "@utils/sleep.js";
import { USER_AGENT } from "@utils/constants.js";
import { GitHubCommits, UserApi } from "@types";

async function getBfUser(): Promise<UserApi | void> {
    const auth = config.auth;
    for (let i = 1; i < 6; i++) {
        const res: Record<string, unknown> & { apiError: { code: any, body: any } } = await page.evaluate(async (auth: string) => {
            let api;

            try {
                api = await fetch("https://api.bloxflip.com/user", {
                    method: "get",
                    headers: {
                        "x-auth-token": auth
                    }
                });

                if (api.ok) {
                    return api.json();
                } else {
                    return { apiError: { code: api?.status, body: await api?.text() }};
                }
            } catch (e) {
                return { apiError: { code: e, body: null }};
            }
        }, auth);

        if (res.success) {
            return res as unknown as UserApi;
        } else if (res.apiError) {
            Logger.warn("PFETCH", `Fetching user data failed, trying again... #${i} \nCode: ${res.apiError.code} \nBody: ${res.apiError.body}`);
            if (i === 2) return Logger.error("PFETCH", `Fetching user data failed. \nCode: ${res.apiError.code} \nBody: ${res.apiError.body}`, { forceClose: true });
            await sleep(5000);
        }
    }
}

async function sendWh(body: any, link: string) {
    const res: { apiError: any } | undefined = await page.evaluate(async (link: string, body: any) => {
        let api;

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


async function getGh(branch: string, hash: string): Promise<GitHubCommits | void> {
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
            if (i === 2) return Logger.error("PFETCH", `Fetching GitHub changes failed. \nError: ${res.apiError}`, { forceClose: true });
            await sleep(5000);
        } else {
            return res as unknown as GitHubCommits;
        }
    }
}

export { getBfUser, sendWh, getGh };
