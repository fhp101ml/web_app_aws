import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "Usuario ya registrado" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create inactive user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                isActive: false, // Explicitly pending approval
                role: 'USER'
            }
        })

        return NextResponse.json({
            message: "Cuenta creada. Esperando aprobación del administrador.",
            userId: user.id
        })

    } catch (error: any) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { message: `Error interno: ${error.message}` },
            { status: 500 }
        )
    }
}
