
import { graph } from "../src/lib/ai/graph";
import { HumanMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    console.log("Testing LangGraph Agent with Tools...");

    if (!process.env.OPENAI_API_KEY) {
        console.error("ERROR: OPENAI_API_KEY is not set in environment.");
        process.exit(1);
    }

    try {
        // Prueba de registro via API
        const inputs = {
            messages: [new HumanMessage("Registra un nuevo usuario llamado 'API Test' con email 'api_test@example.com' y contraseña 'password123'.")],
        };

        const result = await graph.invoke(inputs);
        result.messages.forEach((msg: any, index: number) => {
            console.log(`[Message ${index}] ${msg._getType()}: ${msg.content.slice(0, 100)}...`);
            if (msg.tool_calls?.length) {
                console.log(`   -> Tool Call: ${JSON.stringify(msg.tool_calls)}`);
            }
        });

        const lastMessage = result.messages[result.messages.length - 1];
        console.log("------------------------------------------------");
        console.log("Final Response:", lastMessage.content);
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

main();
