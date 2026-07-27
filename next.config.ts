import type { NextConfig } from "next";
import path from "path";
import withPWAInit from "next-pwa";

const prismaDir = path.resolve(__dirname, "src/generated/prisma");

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    prismaDir,
  ],
};

export default withPWA(nextConfig);
