function sleep(ms: number): Promise<unknown> {
    return new Promise((resolve): void => {
        setTimeout(resolve, ms);
    });
}

export { sleep };
