export interface Config {
    auth: string;
    bet: {
        game: "crash" | "roulette";
        tries: number;
        starting_bet: number;
        crash_autocashout: number;
        roulette_color: "yellow" | "purple" | "red";
    }
    rain: {
        enabled: boolean;
        minimum: number;
        autojoin: {
            enabled: boolean;
            key: string;
        }
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
        verbose: boolean;
        rain_only: boolean;
        disable_analytics: boolean;
        reports: boolean;
        headless: boolean;
    }
}

export interface LoggerOptions {
    customColor?: number;
    seperator?: boolean;
}

export interface Data {
    startupTime: number
    games: Array<CrashGame | RouletteGame>
    rains: Array<Rain>
    latency: Array<number>
}


export interface Game {
    bet: number;
    balance: number;
    crash?: number;
    color?: "red" | "purple" | "yellow";
}

export interface Rain {
    prize: number;
    host: string;
    time: number;
}

export interface User {
    username: string,
    id: number,
    balance: number
}
