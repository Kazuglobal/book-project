'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ImagenPromptGuidePage() {
  const [content, setContent] = useState('');

  useEffect(() => {
    // マークダウンファイルを非同期で読み込む
    fetch('/api/markdown?file=imagen-prompt-guide')
      .then(response => response.json())
      .then(data => {
        setContent(data.content);
      })
      .catch(error => {
        console.error('Error loading markdown:', error);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <Link href="/book-generator" className="text-blue-600 hover:underline">
          ← 本の表紙生成に戻る
        </Link>
      </div>
      
      <div className="prose prose-lg max-w-none">
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
} 