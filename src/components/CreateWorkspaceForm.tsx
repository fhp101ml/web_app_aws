"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateWorkspaceForm({ onSuccess }: { onSuccess: () => void }) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/workspaces", {
                method: "POST",
                body: JSON.stringify({ name, slug }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                setName("");
                setSlug("");
                onSuccess();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel p-6 border border-dashed border-slate-700 bg-[rgba(0,0,0,0.2)]">
            <h3 className="text-lg font-semibold mb-4">Nueva Nube Operativa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Nombre del Entorno</label>
                    <input
                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded px-3 py-2 text-white text-sm"
                        value={name}
                        onChange={e => {
                            setName(e.target.value);
                            setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                        }}
                        placeholder="ej. Producción AWS"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Identificador (Slug)</label>
                    <input
                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded px-3 py-2 text-slate-400 text-sm"
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        placeholder="produccion-aws"
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="btn-primary text-sm px-4 py-2">
                    {loading ? "Creando..." : "Crear Entorno"}
                </button>
            </div>
        </form>
    )
}
