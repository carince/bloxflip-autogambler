async function updateLatency(latency: Array<number>) {
    const average = document.querySelector(".AverageLatency");
    if (latency.length === 0) return;
    if (latency[0] < 0) { return average!.textContent = "Disconnected";}
    
    const averageLatency = (latency.reduce((p, c) => p + c, 0) / latency.length).toFixed(2);
    average!.textContent = `${averageLatency}ms`;
}

export { updateLatency };
