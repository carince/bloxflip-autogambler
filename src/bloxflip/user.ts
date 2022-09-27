import { page } from '../index';
import chalk from 'chalk';
import { Logger } from '../utils/logger';
import { sendWh } from '../utils/webhook';

async function checkAuth() {
    Logger.info(`USER`, `\tFetching user information.`);

    async function start() {
        const res = await page.evaluate(async () => {
            return fetch(`https://rest-bf.blox.land/user`, {
                'headers': {'x-auth-token': localStorage.getItem(`_DO_NOT_SHARE_BLOXFLIP_TOKEN`) || ``}
            }).then(res => res.json());
        });

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
