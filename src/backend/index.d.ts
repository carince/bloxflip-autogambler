export type UserApi = {
    success: boolean
    user: {
        wallet: number
        bonusWallet: number
        robloxUsername: string
        robloxId: number
    }
}

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
    };
    updater: {
        check: boolean;
        auto_update: boolean
    }
    debugging: {
        headless: boolean;
        verbose: boolean;
        launch_options: string[];
    }
}

export type LoggerOptions = {
    customColor?: number;
    seperator?: boolean;
}

export type GitHubCommits = {
    commits: Array<{
        hash: string
        author: string
        message: string
    }>
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

export type Profile = {
    username: string,
    id: number,
}
