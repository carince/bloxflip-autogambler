import { z } from "zod";

export const configSchema = z.object({
    auth: z.string(),
    tries: z.number(),
    starting_bet: z.number(),
    autocashout: z.number(),
    rain: z.object({
        enabled: z.boolean(),
        minimum: z.number(),
        autojoin: z.object({
            enabled: z.boolean(),
            key: z.string(),
        }),
        notifications: z.object({
            os_notifs: z.boolean(),
            webhook: z.object({
                enabled: z.boolean(),
                link: z.string(),
                ping_id: z.string(),
            }),
        }),
    }),
    debugging: z.object({
        verbose: z.boolean(),
        rain_only: z.boolean(),
        disable_analytics: z.boolean(),
        reports: z.boolean(),
        headless: z.boolean(),
    }),
});

export type Config = z.infer<typeof configSchema>;

export interface LoggerOptions {
    customColor?: number
    seperator?: boolean
}

export interface Data {
    startupTime: number
    games: Array<any>
    rains: Array<Rain>
    latency: Array<number>
}

export interface Game {
    count: number
    bet: number
    joined: boolean
    started: boolean
    lossStreak: number
    crash: number
}

export interface Rain {
    prize: number
    host: string
    time: number
}

export interface User {
    username: string
    id: number
    balance: number
}

export interface UserAPIResponse {
    success: boolean
    user: {
        robloxId: number
        robloxUsername: string
        wallet: number
        bonusWallet: number
    }
}
