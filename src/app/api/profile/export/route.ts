import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserService } from "@/lib/services/userService"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
        const exportData = await UserService.exportUserData((session.user as any).id);
        return NextResponse.json(exportData)

    } catch (error: any) {
        if (error.message === "User not found") {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
        return NextResponse.json({ message: "Error exporting data" }, { status: 500 })
    }
}
