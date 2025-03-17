'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Save } from 'lucide-react';

export default function BookPageDesigner() {
  const [pages, setPages] = useState([{ content: '', background: '#ffffff', imageUrl: '' }]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageContent, setPageContent] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageStyle, setPageStyle] = useState('simple');
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');

  const pageStyles = [
    { id: 'simple', name: 'シンプル' },
    { id: 'novel', name: '小説' },
    { id: 'manga', name: '漫画' },
    { id: 'children', name: '絵本' },
    { id: 'technical', name: '技術書' }
  ];

  // ページを保存
  const savePage = () => {
    const updatedPages = [...pages];
    updatedPages[currentPage] = {
      content: pageContent,
      background: backgroundColor,
      imageUrl: generatedImage
    };
    setPages(updatedPages);
  };

  // 新しいページを追加
  const addNewPage = () => {
    setPages([...pages, { content: '', background: '#ffffff', imageUrl: '' }]);
    setCurrentPage(pages.length);
    setPageContent('');
    setBackgroundColor('#ffffff');
    setGeneratedImage('');
  };

  // ページを削除
  const deletePage = () => {
    if (pages.length <= 1) return;
    
    const updatedPages = pages.filter((_, index) => index !== currentPage);
    setPages(updatedPages);
    setCurrentPage(Math.min(currentPage, updatedPages.length - 1));
    
    const newCurrentPage = Math.min(currentPage, updatedPages.length - 1);
    setCurrentPage(newCurrentPage);
    
    if (updatedPages.length > 0) {
      setPageContent(updatedPages[newCurrentPage].content);
      setBackgroundColor(updatedPages[newCurrentPage].background);
      setGeneratedImage(updatedPages[newCurrentPage].imageUrl);
    }
  };

  // ページを切り替え
  const changePage = (direction) => {
    savePage();
    
    let newPage = currentPage;
    if (direction === 'next' && currentPage < pages.length - 1) {
      newPage = currentPage + 1;
    } else if (direction === 'prev' && currentPage > 0) {
      newPage = currentPage - 1;
    }
    
    setCurrentPage(newPage);
    setPageContent(pages[newPage].content);
    setBackgroundColor(pages[newPage].background);
    setGeneratedImage(pages[newPage].imageUrl || '');
  };

  // 画像を生成
  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      setError('画像の説明を入力してください');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Generating image with prompt:', imagePrompt);
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generatePageImage',
          prompt: imagePrompt,
          pageStyle,
          pageContent: pageContent.substring(0, 100) // コンテンツの一部を送信して関連性を高める
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API response error:', errorData);
        throw new Error(errorData.error || '画像生成中にエラーが発生しました');
      }
      
      const data = await response.json();
      
      // 画像URLを設定
      setGeneratedImage(data.imageUrl);
      
      // メッセージがある場合は表示
      if (data.message) {
        console.log('API message:', data.message);
      }
      
      // 生成された画像を現在のページに保存
      savePage();
    } catch (err) {
      console.error('Error generating image:', err);
      
      // APIキーエラーの特別なハンドリング
      if (err.message && err.message.includes('API key is not configured')) {
        setError('Gemini APIキーが設定されていません。管理者に連絡してください。');
      } else {
        setError(err.message || '画像生成中にエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 本全体をPDFとしてエクスポート
  const exportToPDF = () => {
    // PDFエクスポート機能の実装（将来的な拡張）
    alert('PDF出力機能は近日公開予定です');
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">本のページデザイナー</h2>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* プレビュー */}
        <div className="lg:w-1/2 bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="relative w-full aspect-[3/4] flex items-center justify-center"
            style={{ backgroundColor }}
          >
            {generatedImage && (
              <img 
                src={generatedImage} 
                alt="Page illustration" 
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
            <div className="relative z-10 p-8 max-h-full overflow-auto">
              <div 
                className="prose max-w-none"
                style={{ 
                  color: backgroundColor === '#ffffff' ? '#000000' : '#ffffff',
                  textShadow: backgroundColor !== '#ffffff' ? '0 0 5px rgba(0,0,0,0.5)' : 'none'
                }}
              >
                {pageContent.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 flex justify-between items-center">
            <button
              onClick={() => changePage('prev')}
              disabled={currentPage === 0}
              className="p-2 rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <span className="font-medium">ページ {currentPage + 1}/{pages.length}</span>
            </div>
            
            <button
              onClick={() => changePage('next')}
              disabled={currentPage === pages.length - 1}
              className="p-2 rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* 編集パネル */}
        <div className="lg:w-1/2 space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">ページ内容</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  テキスト内容
                </label>
                <textarea
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ページの内容を入力してください..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  背景色
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-500">{backgroundColor}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">画像生成</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ページスタイル
                </label>
                <select
                  value={pageStyle}
                  onChange={(e) => setPageStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {pageStyles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  画像の説明
                </label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="生成したい画像の詳細な説明を入力してください..."
                />
              </div>
              
              <button
                onClick={generateImage}
                disabled={isLoading}
                className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? '生成中...' : '画像を生成'}
              </button>
              
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={savePage}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              保存
            </button>
            
            <button
              onClick={addNewPage}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              新規ページ追加
            </button>
            
            <button
              onClick={deletePage}
              disabled={pages.length <= 1}
              className={`flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                pages.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              ページ削除
            </button>
          </div>
          
          <button
            onClick={exportToPDF}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            PDFとしてエクスポート
          </button>
        </div>
      </div>
    </div>
  );
} 