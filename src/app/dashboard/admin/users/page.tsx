"use client";
"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./users.module.css";
import layoutStyles from "../../layout.module.css";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminUsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'USER' });

    // Auto-scroll
    useEffect(() => {
        fetchUsers();

        // Listen for refresh events from Chat Widget or other components
        const handleRefresh = () => fetchUsers();
        window.addEventListener("REFRESH_USERS_LIST_EVENT", handleRefresh);

        return () => window.removeEventListener("REFRESH_USERS_LIST_EVENT", handleRefresh);
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (res.ok) {
                setIsModalOpen(false);
                setNewUser({ name: '', email: '', password: '', role: 'USER' });
                fetchUsers();
                alert("Usuario creado correctamente");
            } else {
                const err = await res.json();
                alert("Error: " + err.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("ATENCIÓN: Esta acción eliminará permanentemente al usuario. ¿Continuar?")) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setUsers(users.filter(u => u.id !== userId));
            } else {
                alert("No se pudo eliminar el usuario");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAction = async (userId: string, action: string) => {
        const actionText = action === 'approve' ? 'autorizar' : 'revocar';
        // Only confirm for significant actions
        if (!window.confirm(`¿Estás seguro de que deseas ${actionText} el acceso?`)) return;

        // Optimistic update
        setUsers(users.map(u => {
            if (u.id === userId) {
                if (action === 'approve') return { ...u, isActive: true };
                if (action === 'reject') return { ...u, isActive: false };
            }
            return u;
        }));

        try {
            await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, action }),
            });
            fetchUsers();
        } catch (error) {
            console.error(error);
            fetchUsers(); // Revert
        }
    };

    if (!session || (session.user as any).role !== "ADMIN") {
        return <div className="p-8 text-center text-red-500">Acceso denegado.</div>;
    }

    return (
        <main className={layoutStyles.mainContent}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Usuarios Registrados</h1>
                        <p className="text-slate-500 mt-1">Gestiona los accesos y roles de la plataforma.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className={styles.btnSubmit}
                        >
                            + Nuevo Usuario
                        </button>
                    </div>
                </div>

                {/* Top Stats Row */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Total Usuarios</span>
                        <span className={styles.statValue}>{users.length}</span>
                        <div className={`${styles.statDecor} ${styles.decorBlue}`}></div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Activos</span>
                        <span className={styles.statValue}>
                            {users.filter(u => u.isActive).length}
                        </span>
                        <div className={`${styles.statDecor} ${styles.decorGreen}`}></div>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Pendientes</span>
                        <span className={styles.statValue}>
                            {users.filter(u => !u.isActive).length}
                        </span>
                        <div className={`${styles.statDecor} ${styles.decorOrange}`}></div>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Usuario</th>
                                <th className={styles.th}>Rol</th>
                                <th className={styles.th}>Estado</th>
                                <th className={styles.th}>Fecha</th>
                                <th className={`${styles.th} text-right`}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className={styles.emptyState}>Cargando datos del directorio...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={5} className={styles.emptyState}>No se encontraron usuarios.</td></tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <div className={styles.userCell}>
                                            <div className={styles.avatar}>
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>{user.name}</span>
                                                <span className={styles.userEmail}>{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.roleAdmin : styles.roleUser}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={`${styles.statusBadge} ${user.isActive ? styles.statusActive : styles.statusPending}`}>
                                            <span className={styles.dot}></span>
                                            {user.isActive ? 'Activo' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.actions}>
                                            {!user.isActive ? (
                                                <button
                                                    onClick={() => handleAction(user.id, 'approve')}
                                                    className={`${styles.btnAction} ${styles.btnApprove}`}
                                                    title="Aprobar acceso"
                                                >
                                                    Autorizar
                                                </button>
                                            ) : (
                                                user.role === 'ADMIN' ? (
                                                    <span className="text-xs text-slate-500 italic px-3 py-1">Admin</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAction(user.id, 'reject')}
                                                        className={`${styles.btnAction} ${styles.btnReject}`}
                                                        title="Revocar acceso"
                                                    >
                                                        Revocar
                                                    </button>
                                                )
                                            )}

                                            {/* Delete Button */}
                                            {user.id !== (session.user as any).id && (
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className={`${styles.btnAction} ${styles.deleteBtn}`}
                                                    title="Eliminar usuario permanentemente"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 6h18"></path>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create User Modal */}
                {isModalOpen && (
                    <div className={styles.modalOverlay} onClick={(e) => {
                        if (e.target === e.currentTarget) setIsModalOpen(false);
                    }}>
                        <div className={styles.modalContent}>
                            <h2 className={styles.modalTitle}>Nuevo Usuario</h2>
                            <form onSubmit={handleCreateUser} className={styles.modalForm}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nombre completo</label>
                                    <input
                                        type="text"
                                        required
                                        className={styles.input}
                                        value={newUser.name}
                                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Correo electrónico</label>
                                    <input
                                        type="email"
                                        required
                                        className={styles.input}
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="usuario@empresa.com"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Contraseña temporal</label>
                                    <input
                                        type="password"
                                        required
                                        className={styles.input}
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Rol</label>
                                    <select
                                        className={styles.input}
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value="USER" className="text-black">Usuario Estándar</option>
                                        <option value="ADMIN" className="text-black">Administrador</option>
                                    </select>
                                </div>

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className={styles.btnCancel}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.btnSubmit}
                                    >
                                        Crear Usuario
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
