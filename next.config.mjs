/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {} // Next.js 14 server actions are default or need this depending on minor version, strictly 14.0 needs it, 14.2 is default. leaving empty is fine.
    }
};

export default nextConfig;
