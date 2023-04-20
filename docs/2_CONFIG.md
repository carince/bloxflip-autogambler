# Config Documentation

    auth: Your Bloxflip token

    bet: {
        tries: How many times your balance will be divided to 2
        custom: Custom starting bet, tries will be ignored if this is set.
        multiplier: At what multiplier you want to cashout
    }

    webhook: {
        enabled: Toggle webhook
        link: Your Discord webhook URL
    }

    modules: {
        rain: {
            enabled: Toggle rain notifications
            minimum: Minimum robux to notify
            notifications: {
                os_notifs: Toggle sending OS notifications
                webhook {
                    enabled: Toggle rain notifications in webhook
                    ping_id: UserID to ping
                }
            }
        }

        analytics: {
            enabled: Toggle analytics notifications
            notifications: {
                webhook: Toggle analytic notifications in webhook
            }
        }

        updater: {
            enabled: Toggle checking for updates
        }
    }

    debugging: {
        headless: Toggle chrome headless mode
        verbose: Show more verbose logs in console
    }