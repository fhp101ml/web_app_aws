import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: List all workspaces (Admin sees all, User sees theirs)
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = session.user as any;

    try {
        if (user.role === 'ADMIN') {
            const workspaces = await prisma.workspace.findMany({
                include: {
                    _count: {
                        select: { members: true, cloudAccounts: true }
                    },
                    cloudAccounts: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json(workspaces);
        } else {
            // Normal user: only workspaces they belong to
            const memberships = await prisma.workspaceMember.findMany({
                where: { userId: user.id },
                include: {
                    workspace: {
                        include: {
                            _count: {
                                select: { members: true, cloudAccounts: true }
                            }
                        }
                    }
                }
            });
            return NextResponse.json(memberships.map(m => m.workspace));
        }
    } catch (error) {
        return NextResponse.json({ message: "Error fetching workspaces" }, { status: 500 });
    }
}

// POST: Create a new Workspace
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Only Admins or authorized users can create workspaces (for now, let's say only admins/premium)
    // For this MPV, let's allow everyone but tracking the owner.

    try {
        const { name, slug } = await req.json();

        if (!name || !slug) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

        // Check uniqueness
        const existing = await prisma.workspace.findUnique({ where: { slug } });
        if (existing) return NextResponse.json({ message: "Slug already taken" }, { status: 400 });

        const workspace = await prisma.workspace.create({
            data: {
                name,
                slug,
                members: {
                    create: {
                        userId: (session.user as any).id,
                        role: 'OWNER'
                    }
                }
            }
        });

        return NextResponse.json(workspace);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error creating workspace" }, { status: 500 });
    }
}
