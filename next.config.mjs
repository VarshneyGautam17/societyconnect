/** @type {import('next').NextConfig} */
const nextConfig = {
  /* This app is entirely client-rendered (Redux + localStorage state), so the experimental
     Cache Components / Partial Prerendering features (meant for static+dynamic content sites)
     just get in the way here — disabled. */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
