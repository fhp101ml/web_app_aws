"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { useTheme } from "@/context/ThemeContext";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const { theme, toggleTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                name: session.user.name || "",
                email: session.user.email || "",
            }));
        }
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleThemeChange = async (newTheme: "light" | "dark") => {
        if (theme !== newTheme) {
            toggleTheme(); // This updates context and local storage

            // Persist to DB if logged in
            if (session) {
                try {
                    await fetch("/api/profile", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ theme: newTheme }),
                    });
                    await update({ theme: newTheme });
                } catch (error) {
                    console.error("Failed to persist theme", error);
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        try {
            const body: any = { name: formData.name };
            if (formData.newPassword) {
                body.password = formData.newPassword;
            }

            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                await update({ name: formData.name });
                alert("Perfil actualizado correctamente");
                setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
            } else {
                const err = await res.json();
                alert(err.message || "Error al actualizar perfil");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Mi Perfil</h1>
                <p className={styles.subtitle}>Gestiona tu información personal y preferencias.</p>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
                {/* Personal Info */}
                <div className={styles.card}>
                    <div className={styles.sectionTitle}>
                        <svg className={styles.sectionIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        Información Personal
                    </div>
                    <div className={styles.gridTwo}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nombre Completo</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.input}
                                autoComplete="name"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Correo Electrónico</label>
                            <input
                                type="email"
                                value={formData.email}
                                readOnly
                                disabled
                                className={`${styles.input} ${styles.readOnly}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Theme Preference */}
                <div className={styles.card}>
                    <div className={styles.sectionTitle}>
                        <svg className={styles.sectionIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                        Apariencia
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tema de la interfaz</label>
                        <div className={styles.themeSelector}>
                            <div
                                className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
                                onClick={() => handleThemeChange('light')}
                            >
                                <svg className={styles.themeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                                Claro
                            </div>
                            <div
                                className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
                                onClick={() => handleThemeChange('dark')}
                            >
                                <svg className={styles.themeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                Oscuro
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password */}
                <div className={styles.card}>
                    <div className={styles.sectionTitle}>
                        <svg className={styles.sectionIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        Seguridad
                    </div>
                    <div className={styles.gridTwo}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nueva Contraseña</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Dejar en blanco para mantener la actual"
                                autoComplete="new-password"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Confirmar Contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className={styles.btnSubmit} disabled={loading}>
                    {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
            </form>
        </div>
    );
}
