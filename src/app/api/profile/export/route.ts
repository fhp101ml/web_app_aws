import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
        const userData = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                theme: true
                // Add relations here if any exist later (e.g. posts, logs)
            }
        })

        if (!userData) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const exportData = {
            user: userData,
            exportedAt: new Date().toISOString(),
            compliance: "GDPR/LSSI"
        }

        return NextResponse.json(exportData)

    } catch (error) {
        return NextResponse.json({ message: "Error exporting data" }, { status: 500 })
    }
}
