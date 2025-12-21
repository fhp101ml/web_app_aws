"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, Send, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";
import styles from "./AIChatWidget.module.css";

export function AIChatOverlay() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Chat hook
    // Use local state for messages and input to have full control
    const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleClearMessages = () => {
        setMessages([]);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput(""); // Clear input immediately

        // Add user message
        const newMessages = [
            ...messages,
            { id: Date.now().toString(), role: "user", content: userText }
        ];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!res.ok) throw new Error(res.statusText);

            const reply = await res.text();

            // Add bot message
            setMessages((prev) => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: "assistant", content: reply }
            ]);

            // Refresh dashboards or lists if the AI performed an action
            window.dispatchEvent(new Event("REFRESH_USERS_LIST_EVENT"));
        } catch (err) {
            console.error("Chat error:", err);
            // Optional: Show error in chat
        } finally {
            setIsLoading(false);
        }
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mount logic
    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    // Keyboard support for opening/closing? 
    // User specs didn't ask for global shortcuts, but good UX to keep previous listeners if useful? 
    // Prompt said "elimina la configuración actual", so I will strictly follow the new specs. 
    // Use simple internal state.

    const { theme } = useTheme();
    // Inverted logic: App Dark -> Chat Light | App Light -> Chat Dark
    const chatTheme = theme === "dark" ? "light" : "dark";

    if (!mounted || !session) return null;

    return createPortal(
        <div className={chatTheme === "light" ? styles.themeLight : styles.themeDark}>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    className={styles.toggleButton}
                    onClick={() => setIsOpen(true)}
                    aria-label="Toggle AI Chat"
                >
                    <MessageCircle size={32} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={styles.chatWindow}>
                    {/* Header */}
                    <header className={styles.header}>
                        <h3 className={styles.title}>AI Assistant</h3>
                        <div className={styles.headerActions}>
                            <button
                                className={styles.actionBtn}
                                onClick={handleClearMessages}
                                aria-label="Limpiar chat"
                                title="Limpiar chat"
                            >
                                <Trash2 size={18} />
                            </button>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setIsOpen(false)}
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </header>

                    {/* Messages */}
                    <div className={styles.messagesContainer}>
                        {messages.length === 0 && (
                            <div className={`${styles.message} ${styles.botMsg}`}>
                                Hola {session.user?.name || "usuario"}.<br />
                                ¿En qué puedo ayudarte hoy?
                            </div>
                        )}

                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`${styles.message} ${m.role === 'user' ? styles.userMsg : styles.botMsg}`}
                            >
                                {m.content}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer */}
                    <form onSubmit={handleSendMessage} className={styles.footer}>
                        <input
                            className={styles.input}
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Escribe tu mensaje..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className={styles.sendBtn}
                            disabled={isLoading || !input?.trim()}
                            aria-label="Send"
                        >
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>➤</span>
                        </button>
                    </form>
                </div>
            )}
        </div>,
        document.body
    );
}
