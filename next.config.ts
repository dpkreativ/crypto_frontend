import withPWA from "next-pwa";

const withPWA2 = withPWA({
  dest: "public",
  register: true, // Automatically register the service worker
  skipWaiting: true, // Automatically take control of the page when the service worker is updated
});

module.exports = withPWA2({
  images: {
    unoptimized: true,
  },
  sassOptions: {
    api: "modern-compiler",
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore type errors during build
  },
  turbopack: {},
});
