/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  experimental: {
    // keep native/wasm DB drivers out of the webpack bundle
    serverComponentsExternalPackages: ['pg', '@electric-sql/pglite'],
  },
}

module.exports = nextConfig
