
import { StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { AgentState } from "./state";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import {
    registerUserTool,
    listUsersTool,
    approveUserTool,
    adminUpdateUserTool,
    exportUserDataTool,
    getUserTool,
    deleteUserTool,
    updateProfileTool,
    listWorkspacesTool,
    createWorkspaceTool,
    setThemeTool
} from "../../mcp-server/tools";

// Initialize the model
const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
});

// Bind tools to the model
const tools = [
    registerUserTool,
    listUsersTool,
    approveUserTool,
    adminUpdateUserTool,
    exportUserDataTool,
    getUserTool,
    deleteUserTool,
    updateProfileTool,
    listWorkspacesTool,
    createWorkspaceTool,
    setThemeTool
];
const modelWithTools = model.bindTools(tools);

const SYSTEM_PROMPT = `You are the CloudManagement AI Ops Agent.
You have access to the underlying system via a set of powerful tools.

### Your Capabilities
1. **User Management**:
   - Register new users (can set role=ADMIN/USER, isActive=true/false).
   - List all users (optionally filter by active status).
   - Approve users (activate them).
   - **Admin Updates**: You can change ANY user field (role, theme, name, active status) using 'admin_update_user'.
   - **GDPR Export**: You can export full user data JSON using 'export_user_data'.

2. **Workspace Management**:
   - Create new workspaces (slug must be unique).
   - List workspaces (results depend on the user's role).

3. **Client-Side Actions (Magic)**:
   - **Theme Switching**: You can INSTANTLY change the user's interface theme (light/dark) using 'set_theme_client'. 
     - If the user says "dark mode" or "my eyes hurt", use this tool.
     - This does NOT save to the DB, it is a temporary client-side override.

### Instructions
- Always use the tools provided to answer questions or perform actions.
- If a user asks to "make me an admin", use 'admin_update_user'.
- If a user asks for "dark mode", use 'set_theme_client'.
- **CRITICAL**: When using 'set_theme_client', the tool returns a string starting with '[CLIENT_ACTION:THEME=...]'. You MUST include this EXACT tag in your final response to the user, otherwise the UI will not update. Example response: "Sure! [CLIENT_ACTION:THEME=dark] I have switched to dark mode."
- Be concise.
`;

// Define nodes
async function agentNode(state: typeof AgentState.State) {
    const { messages } = state;
    // Prepend System Message
    const messagesWithSystem = [new SystemMessage(SYSTEM_PROMPT), ...messages];
    const response = await modelWithTools.invoke(messagesWithSystem);
    return { messages: [response] };
}

// Define the tool node
const toolNode = new ToolNode(tools);

// Define conditional edge logic
function shouldContinue(state: typeof AgentState.State) {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    // If the LLM wants to call a tool, route to "tools"
    if (lastMessage.tool_calls?.length) {
        return "tools";
    }
    // Otherwise, end
    return "__end__";
}

// Define the graph
const workflow = new StateGraph(AgentState)
    .addNode("agent", agentNode)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue, {
        tools: "tools",
        __end__: "__end__"
    })
    .addEdge("tools", "agent"); // Loop back to agent after tool execution

// Compile the graph
export const graph = workflow.compile();
