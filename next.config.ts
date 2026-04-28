import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 워크트리 lockfile을 우선시하기 위해 트레이싱 루트를 명시.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
