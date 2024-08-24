import { config } from "@utils/config.js";
import { USER_AGENT } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import frmt from "@utils/number.js";
import { User, UserAPIResponse } from "@utils/types.js";
import chalk from "chalk";

let user: User;

async function fetchUserData(): Promise<UserAPIResponse> {
    try {
        const response = await fetch("https://api.bloxflip.com/user", {
            headers: {
                "x-auth-token": config.auth,
            },
            referrerPolicy: "no-referrer",
            body: null,
            method: "GET",
            mode: "cors",
            credentials: "omit",
        }).catch((err) => {
            throw new Error(`Error fetching user data:\n${err}`);
        });

        return (await response.json()) as UserAPIResponse;
    } catch (e) {
        Logger.error("USER/API", e instanceof Error ? e.message : `Unknown Error.\n${e}`, { forceClose: true });
        throw e;
    }
}

async function login(): Promise<void> {
    try {
        const res: UserAPIResponse = await fetchUserData();
        if (!res.success) throw new Error("Invalid auth token.");

        const wallet = frmt(res.user.wallet + res.user.bonusWallet);

        Logger.log(
            "USER",
            `${chalk.bold("Successfully logged in!")}\nUsername: ${res.user.robloxUsername}\nID: ${res.user.robloxId}\nBalance: ${wallet} R$`,
        );

        user = {
            username: res.user.robloxUsername,
            id: res.user.robloxId,
            balance: wallet,
        };

        const baseBet = frmt(wallet / 2 ** config.tries);
        if (baseBet === 0) {
            if (config.debugging.rain_only) return;
            throw new Error("Tries in config is too high causing the bet to be 0");
        }
    } catch (e) {
        Logger.error("USER", e instanceof Error ? e.message : `Unknown Error.\n${e}`);
        throw e;
    }
}

export { login, user };
