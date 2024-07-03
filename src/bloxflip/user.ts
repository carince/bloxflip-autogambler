import { config } from "@utils/config.js";
import { USER_AGENT } from "@utils/constants.js";
import Logger from "@utils/logger.js";
import frmt from "@utils/number.js";
import { User, UserAPIResponse } from "@utils/types.js";
import axios, { AxiosResponse } from "axios";
import chalk from "chalk";

let user: User;

async function fetchUserData(): Promise<UserAPIResponse> {
    try {
        const response = await axios.get<UserAPIResponse>("https://api.bloxflip.com/user", {
            headers: {
                "X-Auth-Token": config.auth,
                "User-Agent": USER_AGENT,
            },
        }).catch((err) => {
            throw new Error(`Data: ${JSON.stringify(err.response.data)}\nStatus: ${err.response.status}\nHeaders: ${JSON.stringify(err.response.headers)}`);
        });

        return (response as AxiosResponse).data;
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

        const baseBet = frmt(wallet / 2 ** config.tries);
        if (baseBet === 0) throw new Error("Tries in config is too high causing the bet to be 0");

        user = {
            username: res.user.robloxUsername,
            id: res.user.robloxId,
            balance: wallet,
        };
    } catch (e) {
        Logger.error("USER", e instanceof Error ? e.message : `Unknown Error.\n${e}`);
        throw e;
    }
}

export { login, user };
