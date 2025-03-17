import { Metadata } from 'next'
import GlobalbunnyGalleryClient from './client'

export const metadata: Metadata = {
  title: 'Globalbunny Storybook Gallery',
  description: 'A single room gallery showcasing interactive storybooks',
};

export default function GlobalbunnyGalleryPage() {
  return <GlobalbunnyGalleryClient />
} 