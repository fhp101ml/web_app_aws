"use client"
import { useState } from "react"
import styles from "../app/login/login.module.css" // Reusing login styles for consistency

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden")
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
