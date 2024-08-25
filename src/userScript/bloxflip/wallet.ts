import frmt from "@utils/number.js";
import { UserAPIResponse } from "@utils/types.js";
// eslint-disable-next-line
import { Manager, Socket } from "socket.io-client/dist/socket.io.dev.js";

import { config } from "../utils/config.js";
import { socketDisconnectReasons } from "../utils/constants.js";
import Logger from "../utils/logger.js";
import { game } from "./crash.js";

let socket: Socket;

async function updateWallet(): Promise<void> {
    try {
        const res = await fetch("https://api.bloxflip.com/user", {
            headers: {
                "x-auth-token": config.auth,
            },
        }).catch((e) => {
            throw new Error(`Unable to fetch user data ${e}`);
        });

        if (!res.ok) {
            throw new Error(`Code: ${res.status}\nBody: ${(await res.text())}`);
        }

        const { user } = await res.json() as UserAPIResponse;
        const wallet = frmt(user.wallet + user.bonusWallet);

        game.balance = wallet;
    } catch (e) {
        Logger.error("WALLET", e instanceof Error ? e.message : `Unknown Error.\n${e}`);
    }
}

export default async function connectWallet(manager: Manager) {
    socket = manager.socket("/wallet").open();

    socket.on("connect", async () => {
        Logger.info("SOCKET/WALLET", "Successfully connected to namespace.");
        socket.emit("auth", config.auth);
    });

    socket.on("disconnect", async (reason: keyof typeof socketDisconnectReasons) => {
        Logger.error("SOCKET/WALLET", `Socket has disconnected, Reason: ${socketDisconnectReasons[reason]}`);
    });

    socket.on("update-wallet", (data: number) => {
        game.balance = frmt(game.balance + data);
    });
}

export { updateWallet };
