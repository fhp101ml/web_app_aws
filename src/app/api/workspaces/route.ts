import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { WorkspaceService } from "@/lib/services/workspaceService";

// GET: List all workspaces (Admin sees all, User sees theirs)
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = session.user as any;

    try {
        const workspaces = await WorkspaceService.listWorkspaces(user.id, user.role);
        return NextResponse.json(workspaces);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching workspaces" }, { status: 500 });
    }
}

// POST: Create a new Workspace
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { name, slug } = await req.json();

        if (!name || !slug) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

        const workspace = await WorkspaceService.createWorkspace({
            name,
            slug,
            ownerId: (session.user as any).id
        });

        return NextResponse.json(workspace);

    } catch (error: any) {
        if (error.message === "Slug already taken") {
            return NextResponse.json({ message: "Slug already taken" }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: "Error creating workspace" }, { status: 500 });
    }
}
