import { curly as curl } from 'node-libcurl'
import chalk from 'chalk';
import { Logger } from '../utils/logger';
import { sendWh } from '../utils/webhook';
import { config } from '../utils/config'

async function checkAuth() {
    Logger.info(`USER`, `\tFetching user information.`);

    async function start() {
        const api = await curl.get(`https://rest-bf.blox.land/user`, {
            userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44`,
            httpHeader: [`x-auth-token: ${config.auth}`],
            sslVerifyPeer: false
        })

        let res
        if (api.statusCode !== 200) {
            Logger.warn(`USER`, `\nFetching user info failed, possibly blocked by cloudflare. Code: ${api.statusCode}`)
            return
        } else {
            res = api.data
        }

        if (res.success) {
            Logger.log(`USER`, `\t${chalk.bold(`User Information`)} \n\t\tUsername: ${res.user.robloxUsername} \n\t\tID: ${res.user.robloxId}\n\t\tBalance: ${Math.round((res.user.wallet + Number.EPSILON) * 100) / 100} R$`);
            sendWh({
                'embeds': [
                    {
                        'title': 'Successfully logged in!',
                        'color': 3092790,
                        'fields': [
                            {
                                'name': 'Username',
                                'value': res.user.robloxUsername,
                                'inline': true
                            },
                            {
                                'name': 'Roblox ID',
                                'value': res.user.robloxId,
                                'inline': true
                            },
                            {
                                'name': 'Balance',
                                'value': `${Math.round((res.user.wallet + Number.EPSILON) * 100) / 100} R$`,
                                'inline': true
                            }
                        ],
                        'footer': {
                            'text': 'bloxflip-autocrash'
                        },
                        'thumbnail': {
                            'url': `https://www.roblox.com/headshot-thumbnail/image?userId=${res.user.robloxId}&width=720&height=720`
                        }
                    }
                ]
            })
        } else {
            Logger.error(`TOKEN`, `Invalid token provided, please put a valid token into the config.`, true);
        }

    } await start();
}

export { checkAuth };
