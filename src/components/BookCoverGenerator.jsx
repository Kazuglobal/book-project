'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ApiKeyWarning from './api-key-warning';

export default function BookCoverGenerator() {
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('fiction');
  const [artStyle, setArtStyle] = useState('digital art');
  const [colorScheme, setColorScheme] = useState('');
  const [mood, setMood] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const genres = [
    'fiction', 'non-fiction', 'fantasy', 'science fiction', 
    'mystery', 'thriller', 'romance', 'historical', 
    'biography', 'self-help', 'business', 'children'
  ];

  const artStyles = [
    'digital art', 'watercolor', 'oil painting', 'manga style', 
    'minimalist', 'photorealistic', '3D rendering', 'pixel art',
    'comic book style', 'vintage poster', 'abstract'
  ];

  const colorSchemes = [
    '', 'vibrant', 'pastel', 'monochrome', 'dark', 'bright', 
    'warm', 'cool', 'sepia', 'neon', 'earthy'
  ];

  const moods = [
    '', 'mysterious', 'cheerful', 'dramatic', 'serene', 'tense', 
    'romantic', 'melancholic', 'epic', 'whimsical', 'futuristic'
  ];

  const buildFullPrompt = () => {
    let fullPrompt = `Create a book cover image for a ${genre} book titled "${bookTitle}" by ${author}.`;
    
    if (artStyle) {
      fullPrompt += ` The style should be ${artStyle}.`;
    }
    
    if (colorScheme) {
      fullPrompt += ` Use a ${colorScheme} color palette.`;
    }
    
    if (mood) {
      fullPrompt += ` The mood should be ${mood}.`;
    }
    
    if (prompt) {
      fullPrompt += ` ${prompt}`;
    }
    
    fullPrompt += ` The title "${bookTitle}" and author name "${author}" should be clearly visible in an appropriate font. High resolution, professional quality. Please generate an image.`;
    
    return fullPrompt;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // 画像生成
      const fullPrompt = buildFullPrompt();
      
      const imageResponse = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateCover',
          prompt: fullPrompt,
          bookTitle,
          author
        }),
      });
      
      if (!imageResponse.ok) {
        const errorData = await imageResponse.json();
        throw new Error(errorData.error || '画像生成中にエラーが発生しました');
      }
      
      const imageData = await imageResponse.json();
      setGeneratedImage(imageData.imageUrl);
      
      // 要約生成
      const summaryResponse = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateSummary',
          bookTitle,
          genre
        }),
      });
      
      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json();
        throw new Error(errorData.error || '要約生成中にエラーが発生しました');
      }
      
      const summaryData = await summaryResponse.json();
      setGeneratedSummary(summaryData.summary);
    } catch (err) {
      console.error('Error generating content:', err);
      setError(err.message || '生成中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">本の表紙を生成</h2>
      
      <div className="mb-4 flex space-x-4">
        <Link href="/docs/imagen-prompt-guide" className="text-blue-600 hover:underline">
          プロンプトガイド
        </Link>
        <Link href="/docs/gemini-api-guide" className="text-blue-600 hover:underline">
          Gemini API ガイド
        </Link>
      </div>
      
      {/* APIキー警告コンポーネント */}
      <ApiKeyWarning />
      
      <div className="mb-4 text-sm text-gray-600">
        <p>効果的な画像生成のために、以下のフォームに詳細を入力してください。</p>
        <p className="mt-1">
          <Link href="/docs/imagen-prompt-guide" className="text-blue-600 hover:underline" target="_blank">
            プロンプト作成ガイドを見る →
          </Link>
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700">
              本のタイトル *
            </label>
            <input
              type="text"
              id="bookTitle"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              著者名 *
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
              ジャンル *
            </label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="artStyle" className="block text-sm font-medium text-gray-700">
              アートスタイル *
            </label>
            <select
              id="artStyle"
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {artStyles.map((style) => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="colorScheme" className="block text-sm font-medium text-gray-700">
              カラースキーム
            </label>
            <select
              id="colorScheme"
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {colorSchemes.map((scheme) => (
                <option key={scheme} value={scheme}>
                  {scheme ? scheme.charAt(0).toUpperCase() + scheme.slice(1) : '指定なし'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="mood" className="block text-sm font-medium text-gray-700">
              ムード・雰囲気
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {moods.map((m) => (
                <option key={m} value={m}>
                  {m ? m.charAt(0).toUpperCase() + m.slice(1) : '指定なし'}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            追加の詳細 (オプション)
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例: 主人公の姿、背景の風景、象徴的なオブジェクトなど、表紙に含めたい具体的な要素"
          />
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
          <p className="font-medium">生成されるプロンプト:</p>
          <p className="mt-1 italic">{buildFullPrompt()}</p>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? '生成中...' : '表紙を生成'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {generatedImage && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">生成された表紙</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img
                src={generatedImage}
                alt={`${bookTitle} by ${author}`}
                className="w-full h-auto rounded-md shadow-md"
              />
              <div className="mt-2 text-center">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = `${bookTitle.replace(/\s+/g, '-')}-cover.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="mt-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  ダウンロード
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <h4 className="text-lg font-medium mb-2">{bookTitle}</h4>
              <p className="text-sm text-gray-500 mb-4">著者: {author}</p>
              <div className="prose">
                <p>{generatedSummary}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 