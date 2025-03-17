'use client';

import Link from 'next/link';
import { Book, BookOpen, Palette, MapPin, Image } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-md py-4 relative" style={{ pointerEvents: 'auto' }}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Book Project
        </Link>
        
        <div className="flex space-x-4">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            ホーム
          </Link>
          <Link 
            href="/book-generator" 
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <Book className="w-4 h-4 mr-1" />
            本の表紙生成
          </Link>
          <Link 
            href="/book-page-designer" 
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-1" />
            ページデザイナー
          </Link>
          <Link 
            href="/kashiwa-book" 
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <MapPin className="w-4 h-4 mr-1" />
            柏の葉絵本
          </Link>
          <Link 
            href="/globalbunny-gallery" 
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <Image className="w-4 h-4 mr-1" />
            絵本ギャラリー
          </Link>
        </div>
      </div>
    </nav>
  );
} 