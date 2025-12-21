import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import rateLimit from "@/lib/rate-limit"
import { UserService } from "@/lib/services/userService"

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
})

async function checkRateLimit(limit: number = 10) {
    try {
        await limiter.check(new NextResponse(), limit, "CACHE_TOKEN") // Using a global token for simplicity or IP if available
    } catch {
        return false
    }
    return true
}

// GET: List all users
export async function GET(req: Request) {
    if (!await checkRateLimit(20)) {
        return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
    }
    const session = await getServerSession(authOptions)

    // Security Check: Only Admins
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    try {
        const users = await UserService.listUsers() // Admin sees all
        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json({ message: "Error fetching users" }, { status: 500 })
    }
}

// POST: Create new user manually
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    try {
        const body = await req.json()
        const { name, email, password, role } = body

        if (!email || !password || !name) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 })
        }

        const newUser = await UserService.registerUser({
            name,
            email,
            password,
            role: role || 'USER',
            isActive: true // Admin created users are active
        })

        return NextResponse.json(newUser, { status: 201 })

    } catch (error: any) {
        if (error.message === "Usuario ya registrado") {
            return NextResponse.json({ message: "User already exists" }, { status: 409 })
        }
        return NextResponse.json({ message: "Error creating user" }, { status: 500 })
    }
}

// DELETE: Remove user
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('id')

    if (!userId) {
        return NextResponse.json({ message: "User ID required" }, { status: 400 })
    }

    // Prevent self-deletion
    if (userId === (session.user as any).id) {
        return NextResponse.json({ message: "Cannot delete yourself" }, { status: 400 })
    }

    try {
        await UserService.deleteUser(userId as string)
        return NextResponse.json({ message: "User deleted" })
    } catch (error) {
        return NextResponse.json({ message: "Error deleting user" }, { status: 500 })
    }
}

// PATCH: Approve/Deactivate User
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    try {
        const { userId, action } = await req.json() // action: 'approve' | 'reject' | 'promote'

        if (!userId) return NextResponse.json({ message: "UserId required" }, { status: 400 })

        const updateData: any = {}

        if (action === 'approve') updateData.isActive = true
        if (action === 'reject') updateData.isActive = false
        if (action === 'promote') updateData.role = 'ADMIN'
        if (action === 'demote') updateData.role = 'USER'

        // We use getUserByEmail normally, but here we have ID. 
        // UserService.updateUser uses email. We might need updateById or fetch email first.
        // For efficiency, let's assume we fetch user first or add updateById to service.
        // Given current service only has updateUser by email, let's fetch email first or add ID support.
        // To keep strictly to plan I will add updateById to service or fetch user. 
        // Actually, fetching user by ID is cleaner.

        // Wait, UserService.updateUser takes email. 
        // Let's modify UserService to support ID or just fetch user here.
        // Fetching user:
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!targetUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const user = await UserService.updateUser(targetUser.email, updateData);

        return NextResponse.json(user)

    } catch (error) {
        return NextResponse.json({ message: "Error updating user" }, { status: 500 })
    }
}
