async function post(path: string, json: any) {
    fetch(`http://localhost:6580/${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    });
}

export { post };
