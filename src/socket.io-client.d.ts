/* eslint-disable max-classes-per-file */
declare module "socket.io-client" {

    import { socketDisconnectReasons } from "@utils/constants.ts";

    export class Manager {
        constructor(url: string, options?: ManagerOptions);
        open(callback: (err: unknown) => Promise<void>): Promise<void>;
        socket(nsp: string): Socket;
    }

    export class Socket {
        open(): Socket;
        on(eventName: string, callback: (...args: any[]) => void): Socket;
        on(eventName: "disconnect", callback: (reason: keyof typeof socketDisconnectReasons) => void): Socket;
        emit(eventName: string, ...args: any[]): Socket;
        close(): Socket;

        connected: boolean;

        disconnected: boolean;
    }
}

interface SocketOptions {
    path?: string;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    reconnectionDelayMax?: number;
    randomizationFactor?: number;
    timeout?: number;
    autoConnect?: boolean;
    query?: object;
    parser?: any;
}

interface EngineOptions {
    upgrade?: boolean;
    forceJSONP?: boolean;
    jsonp?: boolean;
    forceBase64?: boolean;
    enablesXDR?: boolean;
    timestampRequests?: boolean;
    timestampParam?: string;
    policyPort?: number;
    transports?: string[];
    transportOptions?: object;
    rememberUpgrade?: boolean;
    onlyBinaryUpgrades?: boolean;
    requestTimeout?: number;
    protocols?: string[];
}

interface NodeJSOptions {
    agent?: boolean;
    pfx?: string | Buffer;
    key?: string | Buffer;
    passphrase?: string;
    cert?: string | Buffer;
    ca?: string | Buffer | Array<string | Buffer>;
    ciphers?: string;
    rejectUnauthorized?: boolean;
    perMessageDeflate?: boolean | object;
    extraHeaders?: object;
    forceNode?: boolean;
    localAddress?: string;
}

interface ManagerOptions extends SocketOptions, EngineOptions, NodeJSOptions {}
