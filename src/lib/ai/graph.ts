
import { StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { AgentState } from "./state";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { registerUserTool, listUsersTool, approveUserTool } from "../../mcp-server/tools"; // Import utilities directly

// Initialize the model
const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
});

// Bind tools to the model
const tools = [registerUserTool, listUsersTool, approveUserTool];
const modelWithTools = model.bindTools(tools);

// Define nodes
async function agentNode(state: typeof AgentState.State) {
    const { messages } = state;
    const response = await modelWithTools.invoke(messages);
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
