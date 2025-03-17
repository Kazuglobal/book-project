'use client'

import dynamic from 'next/dynamic'

// Three.jsを使用するコンポーネントはクライアントサイドでのみレンダリングするために
// dynamic importを使用します
const GlobalbunnyStoryGalleryRoom = dynamic(
  () => import('../../components/GlobalbunnyStoryGalleryRoom').then(mod => mod.GlobalbunnyStoryGalleryRoom),
  { ssr: false }
)

export default function GlobalbunnyGalleryClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Globalbunny Storybook Gallery</h1>
      <p className="text-center mb-8 text-gray-600">Interactive storybooks in a virtual gallery room</p>
      
      <div className="w-full h-[80vh] bg-gray-100 rounded-lg shadow-lg overflow-hidden relative">
        <GlobalbunnyStoryGalleryRoom />
      </div>
    </div>
  );
} 