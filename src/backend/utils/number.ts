export default function frmt(num: number) {
    const power = 10 ** 2;
    return Math.round(num * power) / power;
}
