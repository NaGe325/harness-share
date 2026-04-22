/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/harness-share",
  images: { unoptimized: true },
};

export default nextConfig;
