import { serverWs } from "./ws.js";

class Logger {
    public static async log(label: string, message: string, options?: { skipEmit: boolean }) {
        console.log(`%c ${label} %c ${message}`, "background-color: green", "color: green");

        if (options?.skipEmit) return;
        if (!serverWs || !serverWs?.connected) return;
        serverWs.emit("new-log", {
            type: "log",
            label: `CLIENT > ${label}`,
            message: message,
        });
    }

    public static async info(label: string, message: string, options?: { skipEmit?: boolean }) {
        console.log(`%c ${label} %c ${message}`, "background-color: blue", "color: blue");

        if (options?.skipEmit) return;
        if (!serverWs || !serverWs?.connected) return;
        serverWs.emit("new-log", {
            type: "info",
            label: `CLIENT > ${label}`,
            message: message,
        });
    }

    public static async warn(label: string, message: string, options?: { skipEmit: boolean }) {
        console.log(`%c ▲ ${label} %c ${message}`, "background-color: yellow; color: black", "color: yellow");

        if (options?.skipEmit) return;
        if (!serverWs || !serverWs?.connected) return;
        serverWs.emit("new-log", {
            type: "warn",
            label: `CLIENT > ${label}`,
            message: message,
        });
    }

    public static async error(label: string, message: string, options?: { forceClose?: boolean, skipEmit?: boolean }) {
        console.log(`%c ⬣ ${label} %c ${message}`, "background-color: red", "color: red");

        if (options?.skipEmit) return;
        if (!serverWs || !serverWs?.connected) return;
        serverWs.emit("new-log", {
            type: "error",
            label: `CLIENT > ${label}`,
            message: message
        });
    }
}

export { Logger };
