import { user as userInfo } from "@bf/user.js";
import Logger from "@utils/logger.js";
import { Command } from "@utils/types.js";
import chalk from "chalk";

const user: Command = {
    name: "user",
    description: "Shows the current users username, id, and balance",
    execute: async () => {
        Logger.log("USER", `${chalk.bold("User Info")}\nUsername: ${userInfo.username}\nID: ${userInfo.id}\nBalance: ${userInfo.balance} R$`);
    },
};

export default user;
