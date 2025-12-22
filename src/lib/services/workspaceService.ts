
import { prisma } from "@/lib/prisma";

export class WorkspaceService {
    static async listWorkspaces(userId: string, userRole: string) {
        if (userRole === 'ADMIN') {
            return prisma.workspace.findMany({
                include: {
                    _count: {
                        select: { members: true, cloudAccounts: true }
                    },
                    cloudAccounts: true
                },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            const memberships = await prisma.workspaceMember.findMany({
                where: { userId },
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
            return memberships.map(m => m.workspace);
        }
    }

    static async createWorkspace(data: { name: string; slug: string; ownerId: string }) {
        const { name, slug, ownerId } = data;

        const existing = await prisma.workspace.findUnique({ where: { slug } });
        if (existing) throw new Error("Slug already taken");

        return prisma.workspace.create({
            data: {
                name,
                slug,
                members: {
                    create: {
                        userId: ownerId,
                        role: 'OWNER'
                    }
                }
            }
        });
    }
}
