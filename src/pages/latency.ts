async function updateLatency(latency: Array<number>) {
    const average = document.querySelector(".AverageLatency");
    if (latency.length !== 0) {
        const averageLatency = (latency.reduce((p, c) => p + c, 0) / latency.length).toFixed(2);
        average!.textContent = `${averageLatency}ms`;
    }
}

export { updateLatency };
