import { NextRequest, NextResponse } from 'next/server';
import { sshStore } from '@/lib/ssh-store';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const session = sshStore.getSession(sessionId);
    if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const stream = new ReadableStream({
        start(controller) {
            const listener = (data: string) => {
                try {
                    // Send as Server-Sent Event or just raw text?
                    // Raw text is simpler for xterm, but SSE is more robust for streaming chunks.
                    // Let's use simple text chunking. xterm can handle incomplete chunks.
                    const encoder = new TextEncoder();
                    controller.enqueue(encoder.encode(data));
                } catch (e) {
                    // Controller might be closed
                    cleanup();
                }
            };

            const cleanup = () => {
                sshStore.removeListener(sessionId, listener);
            };

            sshStore.addListener(sessionId, listener);

            // Cleanup on close
            req.signal.addEventListener('abort', cleanup);
        },
        cancel() {
            // Cleanup handled by abort signal usually
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Content-Type-Options': 'nosniff',
        },
    });
}
