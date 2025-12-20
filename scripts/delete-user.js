const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error("Please provide an email to delete.");
        process.exit(1);
    }

    console.log(`Deleting user: ${email}...`);

    try {
        const deletedUser = await prisma.user.delete({
            where: { email: email },
        });
        console.log(`✅ User deleted successfully: ${deletedUser.email}`);
    } catch (e) {
        if (e.code === 'P2025') {
            console.log("⚠️ User not found (already deleted).");
        } else {
            console.error('❌ Error deleting user:', e);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
