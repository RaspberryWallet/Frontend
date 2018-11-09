import {serverUrl} from "./config";

export async function fetchPing() {
    console.log(`fetching pings`);
    const response = await fetch(serverUrl + '/api/ping');
    const ping = await response.json();
    console.log(`fetched ping ${JSON.stringify(ping)}`);
    return ping;
};

