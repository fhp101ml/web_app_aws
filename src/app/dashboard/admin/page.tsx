import Link from "next/link";

export default function AdminPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Portal de Administración</h1>
            <p className="text-slate-400 mb-8">Gestión centralizada de la plataforma.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* User Management Card */}
                <Link href="/dashboard/admin/users" className="block group">
                    <div className="glass-panel p-6 hover:bg-[rgba(255,255,255,0.03)] transition-colors h-full border border-purple-500/20">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-300 transition-colors">Usuarios</h3>
                        <p className="text-slate-500 text-sm">
                            Aprobar nuevos registros, gestionar roles y desactivar cuentas de equipo.
                        </p>
                    </div>
                </Link>

                {/* Cloud/Workspace Management Card (Next Step) */}
                <Link href="/dashboard/admin/clouds" className="block group">
                    <div className="glass-panel p-6 hover:bg-[rgba(255,255,255,0.03)] transition-colors h-full border border-blue-500/20">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-300 transition-colors">Nubes Operativas</h3>
                        <p className="text-slate-500 text-sm">
                            Conectar cuentas AWS, Azure o GCP y asignarlas a Workspaces.
                        </p>
                    </div>
                </Link>

                {/* Global Settings (Future) */}
                <div className="glass-panel p-6 opacity-50 cursor-not-allowed">
                    <div className="w-12 h-12 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-400 mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Configuración Global</h3>
                    <p className="text-slate-500 text-sm">
                        Ajustes generales del sistema e integraciones.
                    </p>
                </div>

            </div>
        </div>
    )
}
