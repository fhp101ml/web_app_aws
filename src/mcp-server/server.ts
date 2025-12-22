
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { z } from "zod";
import { registerUserTools } from "./tools";

// Initialize the MCP Server
// Note: name and version are required by the SDK
export const server = new McpServer({
    name: "cloud-management-mcp",
    version: "1.0.0",
});

// Register tools
registerUserTools(server);

/* 
 * Transport handling will depend on how we run this. 
 * If running inside Next.js API Routes, we might not need a standard transport 
 * but rather direct usage or a custom adapter.
 * For external usage, we would set up an SSEServerTransport or StdioServerTransport.
 */
