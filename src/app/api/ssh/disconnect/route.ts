import { NextRequest, NextResponse } from 'next/server';
import { sshStore } from '@/lib/ssh-store';

export async function POST(req: NextRequest) {
    try {
        const { sessionId } = await req.json();

        if (sessionId) {
            sshStore.removeSession(sessionId);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
