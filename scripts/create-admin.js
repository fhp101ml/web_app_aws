const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2] || 'admin@exocluster.com';
    const password = process.argv[3] || 'admin123';
    const name = process.argv[4] || 'Admin User';

    console.log(`Creating/Updating user: ${email}...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                role: 'ADMIN',
                isActive: true,
                password: hashedPassword, // Force password update
                name: name
            },
            create: {
                email: email,
                name: name,
                password: hashedPassword,
                role: 'ADMIN',
                isActive: true
            },
        });
        console.log(`✅ User synced successfully:`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
    } catch (e) {
        console.error('❌ Error creating user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
