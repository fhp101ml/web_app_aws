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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

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
            <Link href="/dashboard">
                <div className={styles.logoArea}>
                    <div className={styles.logoIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </div>
                    <span>ExoCluster</span>
                </div>
            </Link>

            {/* Center Navigation */}
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

                <Link href="#" className={styles.navLink + " opacity-50 cursor-not-allowed"}>
                    Documentación
                </Link>
            </nav>

            {/* User Area */}
            <div className={styles.userArea} ref={dropdownRef}>
                <button
                    className={styles.userButton}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{user.name || 'Usuario'}</span>
                        <span className={styles.userRole}>{user.role || 'Member'}</span>
                    </div>
                    <div className={styles.userAvatar}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                </button>

                {isDropdownOpen && (
                    <div className={styles.dropdown}>
                        <div className="px-4 py-2 border-b border-[rgba(255,255,255,0.05)] mb-2">
                            <p className="text-white text-sm font-medium truncate">{user.email}</p>
                        </div>

                        <Link href="/dashboard/profile" className={styles.menuItem}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            Mi Perfil
                        </Link>

                        <button onClick={toggleTheme} className={styles.menuItem}>
                            {theme === 'dark' ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                    Modo Claro
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                    Modo Oscuro
                                </>
                            )}
                        </button>

                        <Link href="#" className={styles.menuItem}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                            Configuración
                        </Link>

                        <div className={styles.divider}></div>

                        <button className={`${styles.menuItem} ${styles.menuItemDanger} w-full`} onClick={async () => {
                            await signOut({ redirect: false });
                            window.location.href = "/login";
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}
