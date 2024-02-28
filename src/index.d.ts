export type Config = {
    auth: string;
    bet: {
        game: "crash" | "roulette";
        tries: number;
        starting_bet: number;
        crash_auto_cashout: number;
        roulette_color: "yellow" | "purple" | "red";
    }
    rain: {
        enabled: boolean;
        minimum: number;
        notifications: {
            os_notifs: boolean;
            webhook: {
                enabled: boolean;
                link: string;
                ping_id: string;
            }
        }
    }
    debugging: {
        reports: boolean;
        verbose: boolean;
    }
}

export type LoggerOptions = {
    customColor?: number;
    seperator?: boolean;
}

export type Data = {
    startupTime: number
    games: Array<Game>
    rains: Array<Rain>
    latency: Array<number>
}

export type Game = {
    crash: number;
    bet: number;
    balance: number;
}

export type Rain = {
    prize: number;
    host: string;
    time: number;
}

export type User = {
    username: string,
    id: number,
    balance: number
}
