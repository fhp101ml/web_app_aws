import { Client, ClientChannel } from 'ssh2';

// Define the session structure
interface SSHSession {
    id: string;
    client: Client;
    stream: ClientChannel | null;
    listeners: ((data: string) => void)[]; // Listeners for incoming data
    lastActivity: number;
}

// Global declaration to persist across hot reloads in dev
declare global {
    var sshSessions: Map<string, SSHSession>;
}

// Initialize the global store if it doesn't exist
if (!global.sshSessions) {
    global.sshSessions = new Map();
}

export const sshStore = {
    addSession: (id: string, client: Client) => {
        global.sshSessions.set(id, {
            id,
            client,
            stream: null,
            listeners: [],
            lastActivity: Date.now(),
        });
    },

    getSession: (id: string) => {
        return global.sshSessions.get(id);
    },

    removeSession: (id: string) => {
        const session = global.sshSessions.get(id);
        if (session) {
            session.client.end();
            session.listeners = [];
            global.sshSessions.delete(id);
        }
    },

    setStream: (id: string, stream: ClientChannel) => {
        const session = global.sshSessions.get(id);
        if (session) {
            session.stream = stream;
            // Hook up data event
            stream.on('data', (data: Buffer) => {
                const text = data.toString('utf-8');
                session.listeners.forEach(listener => listener(text));
                session.lastActivity = Date.now();
            });
            stream.on('close', () => {
                sshStore.removeSession(id);
            });
        }
    },

    addListener: (id: string, listener: (data: string) => void) => {
        const session = global.sshSessions.get(id);
        if (session) {
            session.listeners.push(listener);
        }
    },

    removeListener: (id: string, listener: (data: string) => void) => {
        const session = global.sshSessions.get(id);
        if (session) {
            session.listeners = session.listeners.filter(l => l !== listener);
        }
    },

    write: (id: string, data: string) => {
        const session = global.sshSessions.get(id);
        if (session && session.stream) {
            session.stream.write(data);
            session.lastActivity = Date.now();
        }
    }
};
