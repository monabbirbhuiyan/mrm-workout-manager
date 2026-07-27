import type { NextConfig } from "next";
import path from "path";

const prismaDir = path.resolve(__dirname, "src/generated/prisma");

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    prismaDir,
  ],
};

export default nextConfig;
