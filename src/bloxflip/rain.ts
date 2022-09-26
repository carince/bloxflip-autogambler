import { page } from '../index';
import { notify } from 'node-notifier';
import { Logger } from '../utils/logger';
import { sendWh } from '../utils/webhook';

async function startRain() {
    Logger.info(`RAIN`, `\tStarting rain notifier.`);

    let notified = false;
    async function start() {
        new Promise(() => {
            setTimeout(async () => {
                const res = await page.evaluate(async () => {
                    return fetch(`https://rest-bf.blox.land/chat/history`).then(res => res.json());
                })

                if (res.rain.active) {
                    if (!notified) {
                        notify({
                            title: `AutoCrash Rain Notifier`,
                            message: `Robux: ${res.rain.prize} R$ \nHost: ${res.rain.host} \nTime Remaining: ${res.rain.duration / 60000} minutes`,
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
                                            'value': `${res.rain.prize} R$`,
                                            'inline': true
                                        },
                                        {
                                            'name': 'Host',
                                            'value': res.rain.host,
                                            'inline': true
                                        },
                                        {
                                            'name': 'Time Remaining',
                                            'value': `${res.rain.duration / 60000} minutes`,
                                            'inline': true
                                        }
                                    ],
                                    'footer': {
                                        'text': 'bloxflip-autocrash'
                                    },
                                    'thumbnail': {
                                        'url': 'https://bloxflip.com/favicon.ico'
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