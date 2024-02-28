import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

export const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const socketDisconnectReasons = {
    "io server disconnect": "Server forcefully disconnected.",
    "io client disconnect": "Client forcefully disconnected.",
    "ping timeout": "Server did not respond within ping range.",
    "transport close": "Connection was closed.",
    "transport error": "Connection encountered an error."
};
