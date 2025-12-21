import { z } from "zod";
import { UserService } from "@/lib/services/userService";
import { WorkspaceService } from "@/lib/services/workspaceService";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { tool } from "@langchain/core/tools";

// --- Tool Implementations (Reusable) ---

export const registerUserTool = tool(
    async ({ name, email, password, role, isActive }) => {
        try {
            const user = await UserService.registerUser({ name, email, password, role, isActive });
            return `User registered successfully: ${user.name} (${user.email}). ID: ${user.id}. Role: ${user.role}. Active: ${user.isActive}`;
        } catch (error: any) {
            return `Failed to register user: ${error.message}`;
        }
    },
    {
        name: "register_user",
        description: "Register a new user in the database. Can specify role and active status (Admin only for those).",
        schema: z.object({
            name: z.string().describe("Full name of the user"),
            email: z.string().email().describe("Email address of the user"),
            password: z.string().min(6).describe("Password for the account"),
            role: z.enum(["USER", "ADMIN"]).optional().describe("User role (default: USER)"),
            isActive: z.boolean().optional().describe("Active status (default: false)")
        }),
    }
);

export const listUsersTool = tool(
    async ({ activeOnly }) => {
        try {
            const users = await UserService.listUsers(activeOnly);
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
            const user = await UserService.updateUser(email, { isActive: true });
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

export const adminUpdateUserTool = tool(
    async ({ email, ...updates }) => {
        try {
            const user = await UserService.updateUser(email, updates);
            return `User updated successfully: ${JSON.stringify(user)}`;
        } catch (error: any) {
            return `Failed to update user: ${error.message}`;
        }
    },
    {
        name: "admin_update_user",
        description: "Admin tool to update any user field (role, active status, theme, etc) by email.",
        schema: z.object({
            email: z.string().email(),
            role: z.enum(["USER", "ADMIN"]).optional(),
            isActive: z.boolean().optional(),
            name: z.string().optional(),
            theme: z.enum(["light", "dark"]).optional(),
        })
    }
);

export const exportUserDataTool = tool(
    async ({ userId }) => {
        try {
            const data = await UserService.exportUserData(userId);
            return JSON.stringify(data, null, 2);
        } catch (error: any) {
            return `Failed to export data: ${error.message}`;
        }
    },
    {
        name: "export_user_data",
        description: "Export full data for a specific user ID (GDPR compliance).",
        schema: z.object({
            userId: z.string().describe("UUID of the user"),
        })
    }
);

// --- Workspace Tools ---

export const listWorkspacesTool = tool(
    async ({ userId, userRole }) => {
        try {
            const spaces = await WorkspaceService.listWorkspaces(userId, userRole);
            return JSON.stringify(spaces, null, 2);
        } catch (error: any) {
            return `Error listing workspaces: ${error.message}`;
        }
    },
    {
        name: "list_workspaces",
        description: "List workspaces. Requires userId and userRole to determine visibility.",
        schema: z.object({
            userId: z.string(),
            userRole: z.string()
        })
    }
);

export const createWorkspaceTool = tool(
    async ({ name, slug, ownerId }) => {
        try {
            const space = await WorkspaceService.createWorkspace({ name, slug, ownerId });
            return `Workspace created: ${space.name} (${space.slug})`;
        } catch (error: any) {
            return `Error creating workspace: ${error.message}`;
        }
    },
    {
        name: "create_workspace",
        description: "Create a new workspace.",
        schema: z.object({
            name: z.string(),
            slug: z.string().min(3),
            ownerId: z.string()
        })
    }
);

// --- Client Action Tools ---

export const setThemeTool = tool(
    async ({ theme }) => {
        // This tool does NOT touch the database. It returns a special string.
        return `[CLIENT_ACTION:THEME=${theme}] Sending command to switch theme to ${theme}...`;
    },
    {
        name: "set_theme_client",
        description: "Instantly switch the interface theme (light/dark) for the user. Does not save to profile, acts on client.",
        schema: z.object({
            theme: z.enum(["light", "dark"])
        })
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

    server.tool(
        adminUpdateUserTool.name,
        adminUpdateUserTool.schema as any,
        async (args: any) => {
            const result = await adminUpdateUserTool.invoke(args);
            return { content: [{ type: "text" as const, text: String(result) }] };
        }
    );

    server.tool(
        exportUserDataTool.name,
        exportUserDataTool.schema as any,
        async (args: any) => {
            const result = await exportUserDataTool.invoke(args);
            return { content: [{ type: "text" as const, text: String(result) }] };
        }
    );

    server.tool(
        listWorkspacesTool.name,
        listWorkspacesTool.schema as any,
        async (args: any) => {
            const result = await listWorkspacesTool.invoke(args);
            return { content: [{ type: "text" as const, text: String(result) }] };
        }
    );

    server.tool(
        createWorkspaceTool.name,
        createWorkspaceTool.schema as any,
        async (args: any) => {
            const result = await createWorkspaceTool.invoke(args);
            return { content: [{ type: "text" as const, text: String(result) }] };
        }
    );

    server.tool(
        setThemeTool.name,
        setThemeTool.schema as any,
        async (args: any) => {
            const result = await setThemeTool.invoke(args);
            return { content: [{ type: "text" as const, text: String(result) }] };
        }
    );
}
