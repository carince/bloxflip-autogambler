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
    webhook: {
        enabled: boolean;
        link: string;
    };
    modules: {
        rain: {
            enabled: boolean;
            minimum: number;
            notifications: {
                os_notifs: boolean;
                webhook: {
                    os_notifs: boolean;
                    ping_id: string;
                }
            }
        };
        analytics: {
            enabled: boolean;
            notifications: {
                webhook: true
            }
        };
        updater: {
            enabled: boolean;
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
