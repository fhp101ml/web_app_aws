"use client"
import { useState, useEffect } from "react"
import styles from "../app/login/login.module.css" // Reusing login styles for consistency

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptLegal: false
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [hasReadLegal, setHasReadLegal] = useState(false)
    const [legalStatus, setLegalStatus] = useState({ privacy: false, terms: false })

    useEffect(() => {
        const checkLegalStatus = () => {
            const privacy = localStorage.getItem('legal_privacy_read') === 'true'
            const terms = localStorage.getItem('legal_terms_read') === 'true'
            setLegalStatus({ privacy, terms })
            setHasReadLegal(privacy && terms)
        }

        checkLegalStatus()
        window.addEventListener('storage', checkLegalStatus)
        const interval = setInterval(checkLegalStatus, 1000)

        return () => {
            window.removeEventListener('storage', checkLegalStatus)
            clearInterval(interval)
        }
    }, [])

    const handleLinkClick = () => {
        // No-op
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden")
            setLoading(false)
            return
        }

        if (!formData.acceptLegal) {
            setError("Debes aceptar la Política de Privacidad y el Aviso Legal")
            setLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Error al registrarse")
            } else {
                setSuccess(true)
            }
        } catch (err) {
            setError("Error de conexión")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Solicitud Enviada</h3>
                <p className="text-slate-300">
                    Tu cuenta ha sido creada y está pendiente de aprobación por un administrador.
                    Recibirás una notificación cuando esté activa.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}

            <div className={styles.inputGroup}>
                <label className={styles.label}>Nombre Completo</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                    placeholder="Juan Pérez"
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Email Corporativo</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                    placeholder="nombre@empresa.com"
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Contraseña</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={styles.input}
                    placeholder="••••••••"
                    required
                    minLength={6}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Confirmar Contraseña</label>
                <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={styles.input}
                    placeholder="••••••••"
                    required
                    minLength={6}
                />
            </div>



            <div className={`mb-8 p-5 rounded-xl border transition-all duration-300 ${hasReadLegal ? 'bg-green-500/5 border-green-500/20 shadow-[0_0_15px_-3px_rgba(34,197,94,0.1)]' : 'bg-slate-800/50 border-slate-700/50'}`}>
                <div className="flex items-start gap-4">
                    <div className="pt-1">
                        <input
                            type="checkbox"
                            id="legal"
                            checked={formData.acceptLegal}
                            onChange={(e) => setFormData({ ...formData, acceptLegal: e.target.checked })}
                            disabled={!hasReadLegal}
                            className={`w-5 h-5 rounded border-slate-600 bg-slate-700/50 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all ${!hasReadLegal ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}`}
                        />
                    </div>
                    <div className="flex-1 space-y-3">
                        <label htmlFor="legal" className="text-sm text-slate-300 block leading-relaxed">
                            He leído y acepto la <a href="/legal/privacy" target="_blank" className="text-blue-400 hover:text-blue-300 font-medium hover:underline underline-offset-4 decoration-blue-400/30 transition-colors">Política de Privacidad</a> y el <a href="/legal/terms" target="_blank" className="text-blue-400 hover:text-blue-300 font-medium hover:underline underline-offset-4 decoration-blue-400/30 transition-colors">Aviso Legal</a>.
                        </label>

                        <div className="space-y-2 pt-2 border-t border-white/5">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                <a
                                    href="/legal/privacy"
                                    target="_blank"
                                    className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full transition-colors border ${legalStatus.privacy
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20'}`}
                                >
                                    {legalStatus.privacy
                                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                        : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /></svg>}
                                    Política de Privacidad
                                </a>
                                <a
                                    href="/legal/terms"
                                    target="_blank"
                                    className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full transition-colors border ${legalStatus.terms
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20'}`}
                                >
                                    {legalStatus.terms
                                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                        : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /></svg>}
                                    Aviso Legal
                                </a>
                            </div>

                            {!hasReadLegal && (
                                <p className="text-xs text-slate-400 italic">
                                    * Debes abrir y confirmar la lectura de ambos documentos para continuar.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
            >
                {loading ? 'Enviando...' : 'Solicitar Acceso'}
            </button>
        </form>
    )
}
