export type UserApi = {
    success: boolean
    user: {
        wallet: number
        robloxUsername: string
        robloxId: number
    }
}

export type Config = {
    auth: string;
    bet: {
        tries: number;
        custom: number; 
        multiplier: number;
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
    debugging: {
        headless: boolean;
        verbose: boolean;
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
