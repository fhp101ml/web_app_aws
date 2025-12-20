import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: List all users
export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    // Security Check: Only Admins
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json({ message: "Error fetching users" }, { status: 500 })
    }
}

const bcrypt = require("bcryptjs")

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

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER',
                isActive: true // Manually created users are active by default
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        })

        return NextResponse.json(newUser, { status: 201 })

    } catch (error) {
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
        await prisma.user.delete({
            where: { id: userId }
        })
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

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData
        })

        return NextResponse.json(user)

    } catch (error) {
        return NextResponse.json({ message: "Error updating user" }, { status: 500 })
    }
}
