/* eslint-disable no-console */

import { serverWs } from "./server.js";

export default class Logger {
    public static async log(label: string, message: string) {
        console.log(`%c[ ${label} ]%c ${message}`, "font-weight: bold; color: green", "color: green");

        if (!serverWs || serverWs.disconnected) return;
        serverWs.emit("new-log", {
            type: "log",
            label,
            message,
        });
    }

    public static async info(label: string, message: string) {
        console.log(`%c[ ${label} ]%c ${message}`, "font-weight: bold; color: blue", "color: blue");

        if (!serverWs || serverWs.disconnected) return;
        serverWs.emit("new-log", {
            type: "info",
            label,
            message,
        });
    }

    public static async warn(label: string, message: string) {
        console.log(`%c[ ▲ ${label} ]%c ${message}`, "font-weight: bold; color: yellow", "color: yellow");

        if (!serverWs || serverWs.disconnected) return;
        serverWs.emit("new-log", {
            type: "warn",
            label,
            message,
        });
    }

    public static async error(
        label: string,
        message: string,
        options?: { forceClose: boolean },
    ) {
        console.log(`%c[ ⬣ ${label} ]%c ${message}`, "font-weight: bold; color: red", "color: red");

        if (!serverWs || serverWs.disconnected) return;
        serverWs.emit("new-log", {
            type: "error",
            label,
            message,
            forceClose: options?.forceClose,
        });
    }
}
