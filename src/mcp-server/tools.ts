
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { tool } from "@langchain/core/tools";

// --- Tool Implementations (Reusable) ---

export const registerUserTool = tool(
    async ({ name, email, password }) => {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return `Error: User with email ${email} already exists.`;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Matches the logic of the API (default inactive, role USER)
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "USER",
                    isActive: false, // Mimic API behavior: Pending approval
                },
            });

            return `User registered successfully (Pending Approval): ${user.name} (${user.email}). ID: ${user.id}`;
        } catch (error: any) {
            return `Failed to register user: ${error.message}`;
        }
    },
    {
        name: "register_user",
        description: "Register a new user in the database with email, password, and name. Use this tool locally.",
        schema: z.object({
            name: z.string().describe("Full name of the user"),
            email: z.string().email().describe("Email address of the user"),
            password: z.string().min(6).describe("Password for the account"),
            // Role removed to match API/User intent
        }),
    }
);

export const listUsersTool = tool(
    async ({ activeOnly }) => {
        try {
            const where = activeOnly ? { isActive: true } : {};
            const users = await prisma.user.findMany({
                where,
                select: { id: true, name: true, email: true, role: true, isActive: true },
            });
            return JSON.stringify(users, null, 2);
        } catch (error: any) {
            return `Failed to list users: ${error.message}`;
        }
    },
    {
        name: "list_users",
        description: "List all users in the system, optionally filtered by active status.",
        schema: z.object({
            activeOnly: z.boolean().optional().describe("Filter only active users"),
        }),
    }
);

export const approveUserTool = tool(
    async ({ email }) => {
        try {
            const user = await prisma.user.update({
                where: { email },
                data: { isActive: true },
            });
            return `User approved successfully: ${user.name} (${user.email})`;
        } catch (error: any) {
            return `Failed to approve user: ${error.message}`;
        }
    },
    {
        name: "approve_user",
        description: "Approve (activate) a user account by email.",
        schema: z.object({
            email: z.string().email().describe("Email address of the user to approve"),
        }),
    }
);

// --- MCP Server Registration Helper ---

export function registerUserTools(server: McpServer) {

    server.tool(
        registerUserTool.name,
        registerUserTool.schema as any,
        async (args: any) => {
            const result = await registerUserTool.invoke(args);
            return { content: [{ type: "text" as const, text: String(result) }] };
        }
    );

    server.tool(
        listUsersTool.name,
        listUsersTool.schema as any,
        async (args: any) => {
            const result = await listUsersTool.invoke(args);
            return { content: [{ type: "text" as const, text: String(result) }] };
        }
    );

    server.tool(
        approveUserTool.name,
        approveUserTool.schema as any,
        async (args: any) => {
            const result = await approveUserTool.invoke(args);
            return { content: [{ type: "text" as const, text: String(result) }] };
        }
    );
}
