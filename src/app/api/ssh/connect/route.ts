import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'ssh2';
import { sshStore } from '@/lib/ssh-store';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const { host, username, privateKey } = await req.json();

        if (!host || !privateKey) {
            return NextResponse.json({ error: 'Missing host or privateKey' }, { status: 400 });
        }

        const sessionId = uuidv4();

        // Return a promise that resolves when connection is ready or fails
        return await new Promise<NextResponse>((resolve) => {
            const conn = new Client();

            conn.on('ready', () => {
                sshStore.addSession(sessionId, conn);

                // Start a shell
                conn.shell({ term: 'xterm-256color' }, (err, stream) => {
                    if (err) {
                        conn.end();
                        resolve(NextResponse.json({ error: 'Failed to start shell: ' + err.message }, { status: 500 }));
                        return;
                    }

                    sshStore.setStream(sessionId, stream);
                    resolve(NextResponse.json({ sessionId, success: true }));
                });
            })
                .on('error', (err) => {
                    conn.end();
                    resolve(NextResponse.json({ error: 'Connection failed: ' + err.message }, { status: 500 }));
                })
                .connect({
                    host,
                    port: 22,
                    username: username || 'ec2-user',
                    privateKey: privateKey,
                    readyTimeout: 20000,
                    keepaliveInterval: 10000
                });
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
