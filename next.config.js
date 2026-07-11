/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // supplier product images come from arbitrary CDNs / 1688-style URLs
    ],
  },
};

module.exports = nextConfig;
