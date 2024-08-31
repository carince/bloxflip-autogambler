import { browser } from "@utils/browser.js";
import { config } from "@utils/config.js";
import Logger from "@utils/logger.js";
import { UserAPIResponse } from "@utils/types.js";

export default async function fetchUserData(): Promise<UserAPIResponse> {
    const [page] = await browser.pages();
    const res = await page.evaluate(async (auth: string) => {
        try {
            const api = await fetch("https://api.bloxflip.com/user", {
                method: "get",
                headers: {
                    "x-auth-token": auth,
                },
            });

            if (api.ok) {
                return await api.json();
            }

            return { apiError: { code: api?.statusText, body: await api?.text() } };
        } catch (e) {
            return { apiError: { code: JSON.stringify(e), body: "bro" } };
        }
    }, config.auth);

    if (res.apiError) {
        Logger.error("USER", `Fetching user data failed\nCode: ${res.apiError.code} \nBody: ${res.apiError.body}`, { forceClose: true });
    }

    if (!res.success) {
        Logger.error("USER", "Invalid auth token.", { forceClose: true });
    }

    return res as UserAPIResponse;
}
