
import { NextRequest, NextResponse } from "next/server";
import { graph } from "@/lib/ai/graph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export async function POST(req: NextRequest) {
    console.log("POST /api/chat called");
    try {
        const { messages } = await req.json();
        console.log("Received messages count:", messages.length);

        // Map Vercel AI SDK messages to LangChain messages
        const langChainMessages = messages.map((m: any) => {
            if (m.role === "user") return new HumanMessage(m.content);
            if (m.role === "assistant") return new AIMessage(m.content);
            return new HumanMessage(m.content);
        });

        console.log("Invoking graph...");
        const finalState = await graph.invoke({ messages: langChainMessages });
        const lastMessage = finalState.messages[finalState.messages.length - 1];

        let content = lastMessage.content;
        console.log("Graph finished.");

        if (typeof content !== "string") {
            content = JSON.stringify(content);
        }

        console.log("Final response text:", content);

        // Return simple plain text.
        // Client must be configured with streamProtocol: 'text'
        return new Response(content, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            }
        });

    } catch (error: any) {
        console.error("Error in chat API:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
