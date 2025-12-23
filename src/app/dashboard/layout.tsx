import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import styles from "./layout.module.css";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className={styles.layoutContainer}>
            <Header />

            {/* Main Content Area */}
            <div className={styles.contentWrapper}>
                {children}
            </div>
        </div>
    );
}
