/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    GEMINI_API_KEY: 'AIzaSyBj-RbeGsQBvez1OUiokupt55Vj51S7f6A',
    NEXT_PUBLIC_GEMINI_API_KEY: 'AIzaSyBj-RbeGsQBvez1OUiokupt55Vj51S7f6A',
  },
}

module.exports = nextConfig 