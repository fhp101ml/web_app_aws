"use client";
import { useEffect, useState } from "react";
import CreateWorkspaceForm from "@/components/CreateWorkspaceForm";

interface Workspace {
    id: string;
    name: string;
    slug: string;
    cloudAccounts: any[];
    _count: {
        members: number;
        cloudAccounts: number;
    }
}

export default function AdminCloudsPage() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkspaces = async () => {
        try {
            const res = await fetch("/api/workspaces");
            if (res.ok) {
                const data = await res.json();
                setWorkspaces(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Mis Nubes Operativas</h1>
            <p className="text-slate-400 mb-8">Crea entornos de trabajo (Workspaces) para organizar diferentes infraestructuras.</p>

            <div className="mb-8">
                <CreateWorkspaceForm onSuccess={fetchWorkspaces} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="text-slate-500">Cargando nubes...</div>
                ) : workspaces.map((ws) => (
                    <div key={ws.id} className="glass-panel p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{ws.name}</h3>
                                <p className="text-xs text-purple-400 font-mono bg-purple-500/10 px-2 py-1 rounded inline-block">{ws.slug}</p>
                            </div>
                            <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded font-bold">ACTIVO</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
                            <div className="bg-[rgba(255,255,255,0.03)] p-3 rounded">
                                <p className="text-slate-500 mb-1">Miembros</p>
                                <p className="font-semibold text-lg">{ws._count.members}</p>
                            </div>
                            <div className="bg-[rgba(255,255,255,0.03)] p-3 rounded">
                                <p className="text-slate-500 mb-1">Cuentas Cloud</p>
                                <p className="font-semibold text-lg">{ws._count.cloudAccounts}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)] flex gap-2 relative z-10">
                            <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded text-white flex-1 transition-colors">
                                Gestionar Accesos
                            </button>
                            <button className="text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 px-3 py-2 rounded flex-1 border border-blue-500/30 transition-colors">
                                Configurar AWS
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
