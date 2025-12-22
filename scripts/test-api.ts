
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const url = process.env.NEXTAUTH_URL || "http://localhost:3000";
    console.log(`Testing API at ${url}/api/auth/register`);

    try {
        const res = await fetch(`${url}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Script User",
                email: `test_script_${Date.now()}@example.com`,
                password: "password123"
            })
        });

        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Body:", text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

main();
