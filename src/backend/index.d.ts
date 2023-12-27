export type Config = {
    auth: string;
    bet: {
        tries: number;
        starting_bet: number;
        auto_cashout: number;
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
        quarterly_reports: boolean;
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
