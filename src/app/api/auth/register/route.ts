import { NextResponse } from "next/server"
import { UserService } from "@/lib/services/userService"

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            )
        }

        const user = await UserService.registerUser({ email, password, name });

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
