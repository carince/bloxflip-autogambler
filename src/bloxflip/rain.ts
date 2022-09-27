import { page } from '../index';
import fetch from 'node-fetch'
import { notify } from 'node-notifier';
import { Logger } from '../utils/logger';
import { sendWh } from '../utils/webhook';

async function startRain() {
    Logger.info(`RAIN`, `\tStarting rain notifier.`);

    let notified = false;
    async function start() {
        new Promise(() => {
            setTimeout(async () => {
                const bfApi = await page.evaluate(async () => {
                    return fetch(`https://rest-bf.blox.land/chat/history`).then(res => res.json());
                })

                if (bfApi.rain.active) {
                    if (!notified) {
                        const hostId = await fetch(`https://api.roblox.com/users/get-by-username?username=${bfApi.rain.host}`).then(res => res.json()).then(res => res.Id)

                        notify({
                            title: `AutoCrash Rain Notifier`,
                            message: `Robux: ${bfApi.rain.prize} R$ \nHost: ${bfApi.rain.host} \nTime Remaining: ${bfApi.rain.duration / 60000} minutes`,
                            subtitle: `bloxflip-autocrash`,
                            sound: true
                        });

                        sendWh({
                            'embeds': [
                                {
                                    'title': 'Bloxflip Rain Notifier',
                                    'url': 'https://bloxflip.com',
                                    'color': 3092790,
                                    'fields': [
                                        {
                                            'name': 'Prize',
                                            'value': `${bfApi.rain.prize} R$`,
                                            'inline': true
                                        },
                                        {
                                            'name': 'Host',
                                            'value': bfApi.rain.host,
                                            'inline': true
                                        },
                                        {
                                            'name': 'Time Remaining',
                                            'value': `${bfApi.rain.duration / 60000} minutes`,
                                            'inline': true
                                        }
                                    ],
                                    'footer': {
                                        'text': 'bloxflip-autocrash'
                                    },
                                    'thumbnail': {
                                        'url': `https://www.roblox.com/headshot-thumbnail/image?userId=${hostId}&width=720&height=720`
                                    }
                                }
                            ]
                        })

                        notified = true;
                    }
                } else {
                    notified = false
                }

                await start();
            }, 5000);
        });
    } await start();
}

export { startRain };