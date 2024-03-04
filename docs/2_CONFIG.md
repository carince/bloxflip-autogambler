# Config Documentation

    auth: Your Bloxflip token
    
    bet: {
        game: "roulette" or "crash" 
            Game you want to bet on
        tries: 
            How many times your balance will be divided to 2
        starting_bet: 
            Custom starting bet tries will be ignored if this is set
        crash_autocashout: 
            At what multiplier you want to cashout (only works in crash)
        roulette_color: "purple", "red", or "yellow"
            Color to bet on ( only works in )
    }

    rain: {
        enabled: Toggle rain notifications
        minimum: Minimum robux to notify
        notifications: {
            os_notifs: Toggle sending OS notifications
            webhook: {
                enabled: Toggle sending webhook embeds
                link: Discord Webhook link
                ping_id: User/Role ID to ping.
            }
        }
    }

    // For debugging purposes only dont touch if you dont know what you are doing
    debugging: {
        quarterly_reports: Toggle reports.
        verbose: Toggle info logs.
    }