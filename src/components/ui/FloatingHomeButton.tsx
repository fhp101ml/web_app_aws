"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function FloatingHomeButton() {
    const pathname = usePathname()

    // Don't show on home page
    if (pathname === '/') return null

    return (
        <Link
            href="/"
            className="fixed bottom-8 right-8 p-3 bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 rounded-full shadow-lg transition-all duration-300 z-40 group animate-fade-in hover:scale-110"
            title="Volver al Inicio"
        >
            <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-slate-900 border border-slate-700 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Inicio
            </span>
        </Link>
    )
}
