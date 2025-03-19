'use client';

import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function GeminiApiGuidePage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/book-generator" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          本の表紙生成に戻る
        </Link>
      </div>
      
      <MarkdownRenderer 
        fileName="gemini-api-guide" 
        title="Gemini API 開発ガイド"
        subtitle="革新的な画像生成機能を実装するための総合ガイド"
      />
    </div>
  );
} 