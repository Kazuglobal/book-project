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
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [useAdvancedPrompt, setUseAdvancedPrompt] = useState(false);
  const [promptQuality, setPromptQuality] = useState('');

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

  const analyzePrompt = () => {
    // 簡易的なプロンプト品質チェック
    let quality = 'good';
    let feedback = '';
    
    if (!bookTitle) {
      quality = 'poor';
      feedback += '本のタイトルを入力してください。';
    }
    
    if (!author) {
      quality = quality === 'poor' ? 'poor' : 'fair';
      feedback += '著者名を入力してください。';
    }
    
    if (!genre) {
      quality = quality === 'poor' ? 'poor' : 'fair';
      feedback += 'ジャンルを選択してください。';
    }
    
    const combinedPrompt = buildFullPrompt();
    
    if (combinedPrompt.length < 30) {
      quality = 'fair';
      feedback += 'より詳細なプロンプトを入力すると、より良い結果が得られます。';
    }
    
    if (combinedPrompt.length > 300) {
      quality = 'fair';
      feedback += 'プロンプトが長すぎると処理に時間がかかる場合があります。';
    }
    
    setPromptQuality(quality);
    setFeedbackMessage(feedback || '生成準備ができました！');
    
    return quality !== 'poor';
  };

  const buildFullPrompt = () => {
    // 安全なプロンプトを作成
    let fullPrompt = `Create a book cover design for "${bookTitle}" by ${author}. Genre: ${genre}.`;
    
    if (artStyle) {
      fullPrompt += ` Style: ${artStyle}.`;
    }
    
    if (colorScheme) {
      fullPrompt += ` Color: ${colorScheme}.`;
    }
    
    if (mood) {
      fullPrompt += ` Mood: ${mood}.`;
    }
    
    if (prompt) {
      // ユーザー入力をフィルタリング（任意のテキストが入るので安全対策）
      const safePrompt = prompt.replace(/[^\w\s.,!?:;\-()]/g, '');
      fullPrompt += ` Details: ${safePrompt}`;
    }
    
    fullPrompt += ` Show the title and author name clearly.`;
    
    return fullPrompt;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // プロンプト分析で問題があれば処理を中断
    if (!analyzePrompt()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setGeneratedImage('');
    setGeneratedSummary('');
    
    try {
      // 画像生成
      const fullPrompt = buildFullPrompt();
      
      console.log('Sending request with prompt:', fullPrompt);
      
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
      
      const imageData = await imageResponse.json();
      
      if (!imageResponse.ok) {
        console.error('API Error Response:', imageData);
        throw new Error(imageData.error || '画像生成中にエラーが発生しました');
      }
      
      // APIがイメージURLを返さない場合の処理
      if (!imageData.imageUrl) {
        console.warn('API did not return an image URL:', imageData);
        setError(imageData.message || 'APIから画像が返されませんでした。別のプロンプトをお試しください。');
        if (imageData.summary) {
          setGeneratedSummary(imageData.summary);
        }
        return;
      }
      
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
      
      const summaryData = await summaryResponse.json();
      
      if (!summaryResponse.ok) {
        console.error('Summary API Error:', summaryData);
        // 要約の生成に失敗してもエラーとして表示せず、画像生成は続行
        console.warn('Failed to generate summary, but image generation succeeded');
      } else {
        setGeneratedSummary(summaryData.summary);
      }
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
        
        <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 mb-4">
          <p className="font-medium">生成されるプロンプト:</p>
          <p className="mt-1 italic">{buildFullPrompt()}</p>
          
          <div className={`mt-2 text-sm ${
            promptQuality === 'poor' ? 'text-red-600' : 
            promptQuality === 'fair' ? 'text-orange-600' : 'text-green-600'
          }`}>
            <p>{feedbackMessage}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="advancedPrompt"
              checked={useAdvancedPrompt}
              onChange={(e) => setUseAdvancedPrompt(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="advancedPrompt" className="text-sm text-gray-700">
              高度なプロンプト設定
            </label>
          </div>

          <button
            type="button"
            onClick={analyzePrompt}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            プロンプトを分析
          </button>
        </div>
        
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              promptQuality === 'poor' ? 'bg-gray-400 cursor-not-allowed' :
              isLoading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {isLoading ? '生成中...' : '表紙を生成'}
          </button>
        </div>
      </form>
      
      {generatedImage && (
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6 relative">
          <div className="relative">
            <img
              src={generatedImage}
              alt={`${bookTitle} by ${author}`}
              className="w-full object-contain rounded-md max-h-[600px]"
            />
            {error && error.includes('安全性フィルター') && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-700/70 to-transparent p-4 text-white text-sm">
                <p><strong>注意</strong>: {error}</p>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {generatedSummary && (
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">生成された説明</h3>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="whitespace-pre-line">{generatedSummary}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => {
                // ダウンロード処理
                const link = document.createElement('a');
                link.href = generatedImage;
                link.download = `${bookTitle}_by_${author}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              画像を保存
            </button>
            
            <button
              onClick={() => {
                setGeneratedImage('');
                setGeneratedSummary('');
                setError('');
              }}
              className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md text-sm flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              新しい表紙を生成
            </button>
          </div>
        </div>
      )}

      {useAdvancedPrompt && (
        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-md font-medium mb-3">高度なプロンプト設定</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="imageStyle" className="block text-sm font-medium text-gray-700">
                画像スタイル
              </label>
              <select
                id="imageStyle"
                value={artStyle || ''}
                onChange={(e) => setArtStyle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">選択してください</option>
                <option value="photorealistic">写真のようなリアルな画像</option>
                <option value="digital art">デジタルアート</option>
                <option value="watercolor">水彩画</option>
                <option value="oil painting">油絵</option>
                <option value="pencil sketch">鉛筆スケッチ</option>
                <option value="flat design">フラットデザイン</option>
                <option value="minimalist">ミニマリスト</option>
                <option value="3D render">3Dレンダリング</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="perspective" className="block text-sm font-medium text-gray-700">
                視点/構図
              </label>
              <select
                id="perspective"
                onChange={(e) => {
                  if (e.target.value) {
                    const newPrompt = prompt ? `${prompt}, ${e.target.value}` : e.target.value;
                    setPrompt(newPrompt);
                  }
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">選択してください</option>
                <option value="close-up">クローズアップ</option>
                <option value="wide angle">広角</option>
                <option value="overhead view">真上からの眺め</option>
                <option value="from below">下からの視点</option>
                <option value="symmetrical composition">対称的な構図</option>
                <option value="rule of thirds">三分割法</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="promptEnhancer" className="block text-sm font-medium text-gray-700">
                プロンプト強化
              </label>
              <select
                id="promptEnhancer"
                onChange={(e) => {
                  if (e.target.value) {
                    const newPrompt = prompt ? `${prompt}, ${e.target.value}` : e.target.value;
                    setPrompt(newPrompt);
                  }
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">選択してください</option>
                <option value="high quality">高品質</option>
                <option value="highly detailed">非常に詳細</option>
                <option value="award-winning">受賞作品のような</option>
                <option value="professional book cover">プロフェッショナルな本の表紙</option>
                <option value="trending on artstation">Artstationでトレンド</option>
                <option value="cinematic lighting">映画のような照明</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="promptTips" className="block text-sm font-medium text-gray-700">
                プロンプトのヒント
              </label>
              <div className="mt-1 text-xs text-gray-500">
                <ul className="list-disc pl-4 space-y-1">
                  <li>具体的な指示が最も効果的です</li>
                  <li>主題、スタイル、色彩、構図の順で記述するとよいでしょう</li>
                  <li>「高品質」「詳細」などの形容詞を追加すると効果的です</li>
                  <li>複雑なシーンよりもシンプルなイメージの方が成功しやすいです</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 