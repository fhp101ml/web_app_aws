export default function AwsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">AWS Management Console</h1>
                <button className="btn-primary text-sm px-4 py-2">
                    Refresh Data
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6">
                    <h3 className="text-[hsl(var(--text-muted))] text-sm font-medium mb-2">Total Instances</h3>
                    <p className="text-3xl font-bold">4</p>
                </div>
                <div className="glass-panel p-6">
                    <h3 className="text-[hsl(var(--text-muted))] text-sm font-medium mb-2">Running</h3>
                    <p className="text-3xl font-bold text-green-400">2</p>
                </div>
                <div className="glass-panel p-6">
                    <h3 className="text-[hsl(var(--text-muted))] text-sm font-medium mb-2">Monthly Cost (Est)</h3>
                    <p className="text-3xl font-bold text-orange-400">$42.50</p>
                </div>
            </div>

            <div className="glass-panel p-8 text-center py-20 border-dashed border-2 border-[hsl(var(--glass-border))] bg-transparent shadow-none">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--bg-secondary))] mb-4">
                    <svg className="h-8 w-8 text-[hsl(var(--text-muted))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Conectando con AWS...</h2>
                <p className="text-[hsl(var(--text-muted))] max-w-md mx-auto">
                    El proveedor <code className="bg-[hsl(var(--bg-secondary))] px-2 py-1 rounded text-purple-400">AwsCloudProvider</code> está configurado.
                    La visualización de recursos en tiempo real se implementará en la siguiente fase.
                </p>
            </div>
        </div>
    )
}
