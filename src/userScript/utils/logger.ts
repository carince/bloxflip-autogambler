/* eslint-disable no-console */

import { serverWs } from "./server.js";

export default class Logger {
    public static async log(label: string, message: string, options?: { skipEmit: boolean }) {
        console.log(`%c ${label} %c ${message}`, "font-weight: bold", "color: green");

        if (options?.skipEmit) return;
        if (!serverWs || serverWs.connected) return;
        serverWs.emit("new-log", {
            type: "log",
            label: `CLIENT > ${label}`,
            message,
        });
    }

    public static async info(label: string, message: string, options?: { skipEmit?: boolean }) {
        console.log(`%c ${label} %c ${message}`, "font-weight: bold", "color: blue");

        if (options?.skipEmit) return;
        if (!serverWs || serverWs.connected) return;
        serverWs.emit("new-log", {
            type: "info",
            label: `CLIENT > ${label}`,
            message,
        });
    }

    public static async warn(label: string, message: string, options?: { skipEmit: boolean }) {
        console.log(`%c ▲ ${label} %c ${message}`, "font-weight: bold", "color: yellow");

        if (options?.skipEmit) return;
        if (!serverWs || serverWs.connected) return;
        serverWs.emit("new-log", {
            type: "warn",
            label: `CLIENT > ${label}`,
            message,
        });
    }

    public static async error(
        label: string,
        message: string,
        options?: { forceClose?: boolean, skipEmit?: boolean },
    ) {
        console.log(`%c ⬣ ${label} %c ${message}`, "font-weight: bold", "color: red");

        if (options?.skipEmit) return;
        if (!serverWs || serverWs.connected) return;
        serverWs.emit("new-log", {
            type: "error",
            label: `CLIENT > ${label}`,
            message,
            forceClose: options?.forceClose,
        });
    }
}
