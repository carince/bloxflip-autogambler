import chalk from 'chalk'

export class Logger {
    public static log(type: string, info: string) {
        type.toUpperCase()
        console.log(chalk.greenBright(`${chalk.bold(`[${type}]`)} \t${info}`))
    }

    public static error(type: string, info: string) {
        type.toUpperCase()
        console.log(chalk.redBright(`${chalk.bold(`[${type}]`)} \t${info}`))
        process.exit()   
    }

    public static warn(type: string, info: string) {
        type.toUpperCase()
        console.log(chalk.yellowBright(`${chalk.bold(`[${type}]`)} \t${info}`))
    }
}