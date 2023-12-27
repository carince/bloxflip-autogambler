import axios from "axios";
import chalk from "chalk";
import { config } from "@utils/config.js";
import { Logger } from "@utils/logger.js";
import { USER_AGENT } from "@utils/constants.js";
import { User } from "@types";

let user: User;

async function checkAuth() {
    const data: any = await fetchUserData();
    if (!data.success) return Logger.error("BF/USER", "Invalid auth token.");

    const wallet = +(+data!.user.wallet.toFixed(2) + +data!.user.bonusWallet.toFixed(2)).toFixed(2);
    const baseBet = +(wallet / Math.pow(2, config.bet.tries)).toFixed(2);

    if (baseBet === 0) {
        return Logger.error("USER", "Tries in config is too high causing the bet to be 0", { forceClose: true });
    }

    Logger.log("USER",
        `${chalk.bold("Successfully logged in!")}\nUsername: ${data!.user.robloxUsername}\nID: ${data!.user.robloxId}\nBalance: ${wallet} R$`
    );

    user = {
        username: data!.user.robloxUsername,
        id: data!.user.robloxId,
        balance: wallet
    };
}

async function fetchUserData() {
    try {
        const response = await axios.get("https://api.bloxflip.com/user", {
            withCredentials: true,
            headers: {
                "x-auth-token": config.auth,
                "User-Agent": USER_AGENT
            }
        });

        if (response.status >= 200 && response.status <= 299) {
            return response.data;
        } else {
            return Logger.error("BF/USER", `Fetching user data failed.\nUnexpected response:\nCode: ${response.status}\nResponse: ${response.statusText}\nHeaders: ${JSON.stringify(response.headers, null, 4)}`);
        }
    } catch (err) {
        return Logger.error("BF/USER", `Fetching user data failed.\nError: ${err}`, { forceClose: true });
    }
}

export { checkAuth, fetchUserData, user };
