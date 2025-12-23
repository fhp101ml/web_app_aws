'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Loader2, Terminal as TerminalIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button'; // Assuming we have this
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

interface TerminalModalProps {
    isOpen: boolean;
    onClose: () => void;
    instanceId: string;
    publicIp?: string;
}

export default function TerminalModal({ isOpen, onClose, instanceId, publicIp }: TerminalModalProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [privateKey, setPrivateKey] = useState('');
    const [username, setUsername] = useState('ec2-user');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Refs for terminal instance to persist across renders
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when closed
            disconnect();
            setStatus('idle');
            setPrivateKey('');
            setErrorMsg(null);
        }
    }, [isOpen]);

    const handleConnect = async () => {
        if (!publicIp) {
            setErrorMsg("Instance has no Public IP.");
            return;
        }
        if (!privateKey) {
            setErrorMsg("Private Key is required.");
            return;
        }

        setStatus('connecting');
        setErrorMsg(null);

        try {
            // 1. Initiate Connection
            const res = await fetch('/api/ssh/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    host: publicIp,
                    username,
                    privateKey
                })
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to connect');
            }

            const sid = data.sessionId;
            setSessionId(sid);
            setStatus('connected');

            // 2. Initialize Terminal if not ready
            if (!xtermRef.current && terminalRef.current) {
                const term = new Terminal({
                    cursorBlink: true,
                    fontSize: 14,
                    fontFamily: '"Menlo", "Ubuntu Mono", "Consolas", "DejaVu Sans Mono", "Courier New", monospace',
                    theme: {
                        background: '#1a1b26', // Tokio Night / Dark
                        foreground: '#c0caf5',
                    }
                });
                const fitAddon = new FitAddon();
                term.loadAddon(fitAddon);
                term.open(terminalRef.current);
                fitAddon.fit();

                xtermRef.current = term;
                fitAddonRef.current = fitAddon;

                // Handle Input
                term.onData((input) => {
                    fetch('/api/ssh/write', {
                        method: 'POST',
                        body: JSON.stringify({ sessionId: sid, data: input })
                    }).catch(console.error);
                });

                // Handle resize
                window.addEventListener('resize', () => fitAddon.fit());
            }

            // 3. Start Streaming Output
            startStreaming(sid);

        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setErrorMsg(err.message);
        }
    };

    const startStreaming = async (sid: string) => {
        try {
            const res = await fetch(`/api/ssh/stream?sessionId=${sid}`);
            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            readerRef.current = reader;
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value);
                xtermRef.current?.write(text);
            }
        } catch (err) {
            console.log("Stream ended or error", err);
            // If stream ends unexpectedly
            if (status === 'connected') {
                xtermRef.current?.write('\r\n\x1b[31mConnection closed.\x1b[0m\r\n');
                disconnect();
            }
        }
    };

    const disconnect = async () => {
        if (readerRef.current) {
            await readerRef.current.cancel();
            readerRef.current = null;
        }
        if (sessionId) {
            await fetch('/api/ssh/disconnect', {
                method: 'POST',
                body: JSON.stringify({ sessionId })
            });
            setSessionId(null);
        }

        if (xtermRef.current) {
            xtermRef.current.dispose();
            xtermRef.current = null;
        }
        setStatus('idle');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1b26] w-full max-w-5xl h-[80vh] rounded-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#15161e]">
                    <div className="flex items-center gap-2 text-white/90">
                        <TerminalIcon className="w-5 h-5 text-green-400" />
                        <span className="font-semibold tracking-wide">SSH Console</span>
                        <span className="text-white/40 text-sm font-mono ml-2">
                            {instanceId} {publicIp ? `(${publicIp})` : ''}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 relative bg-[#1a1b26] flex flex-col">

                    {/* Setup Form (Overlay if not connected) */}
                    {status !== 'connected' && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-[#1a1b26]">
                            <div className="w-full max-w-md space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-medium text-white">Connection Details</h2>
                                    <p className="text-sm text-white/50">
                                        Enter your private key (PEM) to connect effectively.
                                        Keys are not stored persistently.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-white/40 font-semibold">Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-[#15161e] border border-white/10 rounded-md px-3 py-2 text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/20"
                                            placeholder="ec2-user"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-white/40 font-semibold">Private Key (PEM)</label>
                                        <textarea
                                            value={privateKey}
                                            onChange={(e) => setPrivateKey(e.target.value)}
                                            className="w-full h-32 bg-[#15161e] border border-white/10 rounded-md px-3 py-2 text-xs font-mono text-white/80 outline-none focus:border-blue-500/50 transition-colors resize-none placeholder:text-white/20"
                                            placeholder="-----BEGIN RSA PRIVATE KEY-----..."
                                        />
                                    </div>

                                    {errorMsg && (
                                        <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-md border border-red-400/20">
                                            {errorMsg}
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleConnect}
                                        disabled={status === 'connecting' || !privateKey}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                                    >
                                        {status === 'connecting' ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            'Connect via SSH'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Terminal Container */}
                    <div
                        ref={terminalRef}
                        className={`flex-1 w-full h-full p-2 ${status === 'connected' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    />
                </div>
            </div>
        </div>
    );
}
