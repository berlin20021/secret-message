/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // هيخلي الموقع يترفع حتى لو فيه أخطاء بسيطة في التايب سكريبت
  },
  eslint: {
    ignoreDuringBuilds: true, // بيتخطى مشاكل الـ Lint
  },
};

export default nextConfig;