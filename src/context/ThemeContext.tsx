"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [theme, setTheme] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Effect to handle initial load and session changes
    useEffect(() => {
        if (status === "loading") return;

        if (status === "authenticated" && session?.user?.theme) {
            // User is logged in, use their preference
            const userTheme = session.user.theme as Theme;
            setTheme(userTheme);
            document.documentElement.setAttribute("data-theme", userTheme);
            localStorage.setItem("theme", userTheme);
        } else if (status === "unauthenticated") {
            // User is logged out -> FORCE DARK MODE
            setTheme("dark");
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.removeItem("theme"); // Clear local pref so login starts fresh or system default
        } else {
            // Check local storage if not authenticated (or initial load)
            const savedTheme = localStorage.getItem("theme") as Theme;
            if (savedTheme) {
                setTheme(savedTheme);
                document.documentElement.setAttribute("data-theme", savedTheme);
            } else {
                setTheme("dark");
                document.documentElement.setAttribute("data-theme", "dark");
            }
        }
    }, [status, session]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
