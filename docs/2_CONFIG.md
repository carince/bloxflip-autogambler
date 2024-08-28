# Config Documentation

## `auth`

- Paste your Bloxflip token here.

## `bet`

- **tries**: Number of times your balance will be divided by 2.
- **starting_bet**: Custom starting bet; if set, `tries` will be ignored.
- **autocashout**: Multiplier at which you want to cash out.

## `rain`

- **enabled**: Toggle rain notifications on or off.
- **minimum**: Minimum Robux amount.
- **autojoin**:
  - **enabled**: Toggle auto-joining rain events.
- **notifications**:
  - **enabled**: Toggle sending notifications.
  - **link**: Discord webhook link for notifications.
  - **ping_id**: User/Role ID to ping in notifications.

## `debugging`

- **verbose**: Toggle verbose logging.
- **rain_only**: Disable autogambling and only join rains.
- **headless**: Toggle Chrome headless mode.
- **chrome_options**: Additional Puppeteer Chrome launch options.