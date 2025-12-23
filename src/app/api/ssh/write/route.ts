import { NextRequest, NextResponse } from 'next/server';
import { sshStore } from '@/lib/ssh-store';

export async function POST(req: NextRequest) {
    try {
        const { sessionId, data } = await req.json();

        if (!sessionId || data === undefined) {
            return NextResponse.json({ error: 'Missing sessionId or data' }, { status: 400 });
        }

        const session = sshStore.getSession(sessionId);
        if (!session) {
            return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 });
        }

        sshStore.write(sessionId, data);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
