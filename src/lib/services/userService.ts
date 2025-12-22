
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export class UserService {
    /**
     * Creates a new user.
     * Throws an error if the user already exists.
     */
    static async registerUser(data: { name?: string; email: string; password: string; role?: 'USER' | 'ADMIN'; isActive?: boolean }) {
        const { email, password, name, role = "USER", isActive = false } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("Usuario ya registrado");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                isActive,
                role,
            },
        });

        return user;
    }

    static async exportUserData(userId: string) {
        const userData = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                theme: true
            }
        });

        if (!userData) {
            throw new Error("User not found");
        }

        return {
            user: userData,
            exportedAt: new Date().toISOString(),
            compliance: "GDPR/LSSI"
        };
    }

    /**
     * Updates an existing user's profile.
     */
    static async updateUser(email: string, data: { name?: string; password?: string; theme?: string, isActive?: boolean; role?: string }) {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.theme !== undefined) updateData.theme = data.theme;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;
        if (data.role !== undefined) updateData.role = data.role;

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        // Only update if there is data to update
        if (Object.keys(updateData).length === 0) {
            // Fetch and return user to ensure we return a valid object even if no update needed
            return prisma.user.findUniqueOrThrow({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    theme: true,
                }
            });
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                theme: true,
            },
        });

        return updatedUser;
    }

    static async getUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                theme: true,
                isActive: true
            }
        });
    }

    static async deleteUser(id: string) {
        return prisma.user.delete({
            where: { id },
        });
    }

    static async listUsers(activeOnly: boolean = false) {
        const where = activeOnly ? { isActive: true } : {};
        return prisma.user.findMany({
            where,
            select: { id: true, name: true, email: true, role: true, isActive: true },
        });
    }
}
