"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "@/context/ThemeContext"
import styles from "./header.module.css"

export default function Header() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const { theme, toggleTheme } = useTheme()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (!session) return null

    const user = session.user as any
    const isAdmin = user.role === 'ADMIN'

    // Helper for active link class
    const isActive = (path: string) => pathname === path ? styles.navLinkActive : ''

    return (
        <header className={styles.header}>
            {/* Logo Area */}
            <Link href="/dashboard" aria-label="Ir al inicio">
                <div className={styles.logoArea}>
                    <div className={styles.logoIcon}>
                        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </div>
                    <span>ExoCluster</span>
                </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.nav}>
                <Link href="/dashboard" className={`${styles.navLink} ${isActive('/dashboard')}`}>
                    Inicio
                </Link>

                {isAdmin && (
                    <>
                        <Link href="/dashboard/admin/users" className={`${styles.navLink} ${isActive('/dashboard/admin/users')}`}>
                            Usuarios
                        </Link>
                    </>
                )}

                <Link href="#" className={styles.navLink + " opacity-50 cursor-not-allowed"} aria-disabled="true" role="link">
                    Documentación
                </Link>

                {/* AI Chat Trigger */}
                <button
                    onClick={() => {
                        console.log("Dispatching OPEN_AI_CHAT");
                        window.dispatchEvent(new Event("OPEN_AI_CHAT"));
                    }}
                    className={`${styles.navLink} inline-flex items-center gap-2`}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                    Asistente AI
                </button>
            </nav>

            <div className={styles.rightActions}>
                {/* Mobile Menu Toggle */}
                <button
                    className={styles.mobileToggle}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Abrir menú"
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                    )}
                </button>

                {/* User Area */}
                <div className={styles.userArea} ref={dropdownRef}>
                    <button
                        className={styles.userButton}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                        aria-label="Menú de usuario"
                    >
                        <div className={styles.userInfo}>
                            <span className={`${styles.userName} text-gray-900 dark:text-white`}>{user.name || 'Usuario'}</span>
                            <span className={`${styles.userRole} text-gray-500 dark:text-gray-400`}>{user.role || 'Member'}</span>
                        </div>
                        <div className={styles.userAvatar}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                    </button>

                    {isDropdownOpen && (
                        <div className={styles.dropdown} role="menu">
                            <div className="px-4 py-2 border-b border-[rgba(255,255,255,0.05)] mb-2">
                                <p className="text-white text-sm font-medium truncate">{user.email}</p>
                            </div>

                            <Link href="/dashboard/profile" className={styles.menuItem} role="menuitem">
                                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                Mi Perfil
                            </Link>

                            <button onClick={toggleTheme} className={styles.menuItem} role="menuitem">
                                {theme === 'dark' ? (
                                    <>
                                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                        Modo Claro
                                    </>
                                ) : (
                                    <>
                                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                        Modo Oscuro
                                    </>
                                )}
                            </button>

                            <Link href="#" className={styles.menuItem} role="menuitem">
                                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                                Configuración
                            </Link>

                            <div className={styles.divider}></div>

                            <button className={`${styles.menuItem} ${styles.menuItemDanger} w-full`} onClick={async () => {
                                await signOut({ redirect: false });
                                window.location.href = "/login";
                            }} role="menuitem">
                                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <nav className={styles.mobileNav}>
                        <Link href="/dashboard" className={`${styles.mobileNavLink} ${isActive('/dashboard')}`}>
                            <div className={styles.mobileNavIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            </div>
                            Inicio
                        </Link>

                        {isAdmin && (
                            <Link href="/dashboard/admin/users" className={`${styles.mobileNavLink} ${isActive('/dashboard/admin/users')}`}>
                                <div className={styles.mobileNavIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                </div>
                                Usuarios
                            </Link>
                        )}

                        <Link href="#" className={styles.mobileNavLink + " opacity-50 cursor-not-allowed"}>
                            <div className={styles.mobileNavIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            </div>
                            Documentación
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    )
}
