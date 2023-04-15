import { post } from "./api.js";

interface loggerOptions {
    customColor?: number;
    seperator?: boolean;
    forceClose?: boolean;
}

export class Logger {
    public static log(label: string, message: string, options?: loggerOptions): void {
        post(`log/log`, {
            logs: {
                label: label,
                message: message,
                options: options
            }
        })

        console.log(`[${label}] ${message}`);
    }

    public static info(label: string, message: string): void {
        post(`log/info`, {
            logs: {
                label: label,
                message: message
            }
        })

        console.log(`[${label}] ${message}`);
    }

    public static warn(label: string, message: string): void {
        post(`log/warn`, {
            logs: {
                label: label,
                message: message
            }
        })

        console.warn(`[${label}] ${message}`);
    }

    public static error(label: string, message: string, forceClose: boolean): void {
        post(`log/error`, {
            logs: {
                label: label,
                message: message,
                options: {
                    forceClose: forceClose
                }
            }
        })

        console.error(`[${label}] ${message}`);
    }
}