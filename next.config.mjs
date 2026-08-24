/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js ships untranspiled ESM in some subpaths; let Next transpile it.
  transpilePackages: ["three"],
};

export default nextConfig;
