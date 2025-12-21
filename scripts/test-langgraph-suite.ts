
import { graph } from "../src/lib/ai/graph";
import { HumanMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";

dotenv.config();

async function runTest(name: string, prompt: string) {
    console.log(`\n\n=== RUNNING TEST: ${name} ===`);
    console.log(`User Input: "${prompt}"`);

    try {
        const inputs = {
            messages: [new HumanMessage(prompt)],
        };

        const result = await graph.invoke(inputs);

        console.log("--- Execution Steps ---");
        result.messages.forEach((msg: any, index: number) => {
            if (msg._getType() === "ai" && msg.tool_calls?.length) {
                console.log(`[AI] Tool Call: ${JSON.stringify(msg.tool_calls)}`);
            } else if (msg._getType() === "tool") {
                console.log(`[Tool] Output: ${msg.content.slice(0, 100)}...`);
            }
        });

        const lastMessage = result.messages[result.messages.length - 1];
        console.log("--- Final Response ---");
        console.log(lastMessage.content);
        return true;
    } catch (error) {
        console.error(`TEST FAILED: ${name}`, error);
        return false;
    }
}

async function main() {
    console.log("Starting LangGraph Comprehensive Test Suite...");

    if (!process.env.OPENAI_API_KEY) {
        console.error("ERROR: OPENAI_API_KEY is not set.");
        process.exit(1);
    }

    // Test 1: General Chat (No Tools)
    await runTest("General Chat", "Hola, ¿cómo estás? ¿Qué eres?");

    // Test 2: List Users (Tool Call)
    await runTest("List Users", "Lista los usuarios activos en el sistema.");

    // Test 3: Register User (Tool Call)
    // Using a random suffix to avoid unique constraint errors on repeated runs
    const randomId = Math.floor(Math.random() * 1000);
    await runTest("Register User", `Registra un nuevo usuario llamado 'TestUser_${randomId}' con email 'test${randomId}@example.com' y rol 'user'.`);

    console.log("\n=== ALL TESTS COMPLETED ===");
}

main();
