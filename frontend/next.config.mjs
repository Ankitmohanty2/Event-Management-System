const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      resolveAlias: {
        "@/*": ["./src/*"],
      },
    },
  },
};

export default nextConfig;
