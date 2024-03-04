async function updateLatency(latency: Array<number>) {
    const average = document.querySelector(".AverageLatency");
    const indicator = document.querySelectorAll(".IndicatorLatency > span");

    if (latency.length === 0) return;

    let color = "bg-gray-400"
    const averageLatency = latency.reduce((p, c) => p + c, 0) / latency.length;
    average!.textContent = `${averageLatency}ms`;

    if (latency[0] < 0) {
        average!.textContent = "Disconnected";
        color = "bg-gray-400"
    } else if (averageLatency <= 250) {
        color = "bg-green-400"
    } else if (averageLatency <= 500) {
        color = "bg-orange-400"
    } else {
        color = "bg-red-400"
    }

    indicator.forEach((x) => {
        x!.classList.remove("bg-orange-400", "bg-green-400", "bg-gray-400");
        x!.classList.add(color)
    })

}

export { updateLatency };
