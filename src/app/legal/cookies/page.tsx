
import LegalAcknowledge from "@/components/legal/LegalAcknowledge";
import { Cookie, Settings, BarChart3, ShieldCheck } from "lucide-react";

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-300 font-sans selection:bg-teal-500/30 relative overflow-hidden flex flex-col items-center justify-center py-20 px-4 sm:px-6">

            {/* Background Ambiance */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-teal-600/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-green-600/5 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <main className="relative z-10 w-full max-w-4xl animate-slide-up">
                <header className="text-center mb-16 space-y-6">


                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold tracking-wider uppercase shadow-[0_0_10px_-3px_rgba(20,184,166,0.3)]">
                            <Cookie className="w-3 h-3" />
                            Transparencia
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-100 to-teal-400 tracking-tight">
                            Política de Cookies
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Control total sobre los datos que compartes. Entiende cómo y para qué usamos las cookies.
                        </p>
                    </div>
                </header>

                <div className="grid gap-10 md:gap-12">
                    {/* Definición */}
                    <section className="relative group">
                        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                            <div className="p-4 rounded-2xl bg-teal-500/10 text-teal-400 shrink-0 border border-teal-500/20 shadow-[0_0_20px_-5px_rgba(20,184,166,0.2)]">
                                <Cookie className="w-6 h-6" strokeWidth={1.5} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white tracking-tight">1. ¿Qué son las Cookies?</h2>
                                <p className="text-slate-300 leading-8 text-base font-light">
                                    Las cookies no son más que pequeños fragmentos de datos que nos permiten "recordar" quién eres. No contienen virus ni acceden a tu disco duro. Son la memoria a corto plazo de nuestra aplicación.
                                </p>
                                <p className="text-slate-400 leading-relaxed">
                                    Las utilizamos para mantener tu sesión segura, recordar tu idioma preferido y asegurar que nadie suplante tu identidad.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Tipos */}
                    <section className="relative group">
                        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                            <div className="p-4 rounded-2xl bg-green-500/10 text-green-400 shrink-0 border border-green-500/20 shadow-[0_0_20px_-5px_rgba(34,197,94,0.2)]">
                                <Settings className="w-6 h-6" strokeWidth={1.5} />
                            </div>
                            <div className="space-y-6 w-full">
                                <h2 className="text-2xl font-bold text-white tracking-tight">2. Categorías de Uso</h2>
                                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                        <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-3">
                                            <ShieldCheck className="w-5 h-5 text-green-400 relative bottom-0.5" strokeWidth={1.5} /> Esenciales
                                        </h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Nucleares para la plataforma. Sin ellas, no podrías iniciar sesión ni desplegar servidores. No se pueden desactivar.
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                        <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-3">
                                            <BarChart3 className="w-5 h-5 text-blue-400 relative bottom-0.5" strokeWidth={1.5} /> Analíticas
                                        </h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Nos ayudan a detectar cuellos de botella y errores en la interfaz. Son anónimas y nos permiten mejorar tu experiencia.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Gestión */}
                    <section className="relative group">
                        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 shrink-0 border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)]">
                                <Settings className="w-6 h-6" strokeWidth={1.5} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white tracking-tight">3. Tu Control Total</h2>
                                <p className="text-slate-300 leading-8 text-base font-light">
                                    El navegador es tuyo. Puedes borrar, bloquear o gestionar las cookies en cualquier momento. Aquí tienes las guías oficiales para los principales navegadores:
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors border border-white/5 hover:border-white/20">Chrome &rarr;</a>
                                    <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors border border-white/5 hover:border-white/20">Firefox &rarr;</a>
                                    <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors border border-white/5 hover:border-white/20">Safari &rarr;</a>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-24 flex flex-col items-center gap-6 pb-12">
                    <div className="h-px w-full max-w-sm bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <LegalAcknowledge id="cookies" title="Política de Cookies" />
                </div>
            </main>
        </div>
    )
}
