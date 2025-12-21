
import { getServerSession } from "next-auth";
import { UserService } from "@/lib/services/userService";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, password, theme } = body;

        const updatedUser = await UserService.updateUser(session.user.email, {
            name,
            password,
            theme,
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Error updating profile" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await UserService.getUserByEmail(session.user.email);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ message: "Error fetching profile" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
        await UserService.deleteUser((session.user as any).id);

        return NextResponse.json({ message: "Account deleted" })

    } catch (error) {
        return NextResponse.json({ message: "Error deleting account" }, { status: 500 })
    }
}
