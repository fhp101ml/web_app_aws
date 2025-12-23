import { config } from 'dotenv';
config(); // Load .env

import { AwsCloudProvider } from '../src/infrastructure/aws/AwsCloudProvider';

async function main() {
    console.log("Testing AwsCloudProvider...");
    console.log("Provider Type:", process.env.AWS_PROVIDER_TYPE);
    console.log("Endpoint:", process.env.LOCALSTACK_ENDPOINT);

    try {
        const provider = new AwsCloudProvider();
        console.log("Fetching instances...");
        const instances = await provider.listInstances();
        console.log("Instances found:", instances);

        if (instances.length === 0) {
            console.log("No instances found (expected for fresh LocalStack)");
            // Optional: Create one if possible? EC2Client -> RunInstancesCommand
            // But we didn't implement createInstance in provider yet.
        }

    } catch (e) {
        console.error("Error during verification:", e);
    }
}

main();
