/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,



  // ✅ ALLOW CLOUDFLARE R2 IMAGES
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-bf7907456391450294524d84ba079ed0.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
