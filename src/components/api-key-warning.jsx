'use client';

import { useState, useEffect } from 'react';
import { getApiKeyErrorMessage } from '@/lib/gemini';

export default function ApiKeyWarning() {
  const [apiKeyError, setApiKeyError] = useState(null);

  useEffect(() => {
    // クライアントサイドでAPIキーをチェック
    const errorMessage = getApiKeyErrorMessage();
    if (errorMessage) {
      setApiKeyError(errorMessage);
    }
  }, []);

  if (!apiKeyError) return null;

  return (
    <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
      <p className="font-bold">警告: {apiKeyError}</p>
      <p className="text-sm mt-1">
        <a 
          href="https://ai.google.dev/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline"
        >
          Google AI Studioでキーを取得
        </a>
        して、.env.localファイルに設定してください。
      </p>
    </div>
  );
} 