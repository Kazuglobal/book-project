import { useState, useEffect } from 'react';
import '../components/MarkdownStyles.css';

/**
 * マークダウンコンテンツを洗練されたスタイルで表示するコンポーネント
 * 
 * @param {Object} props コンポーネントのプロパティ
 * @param {string} props.fileName マークダウンファイルの名前（拡張子なし）
 * @param {string} props.title ページタイトル（オプション）
 * @param {string} props.subtitle サブタイトル（オプション）
 */
export default function MarkdownRenderer({ fileName, title, subtitle }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // マークダウンファイルを非同期で読み込む
    fetch(`/api/markdown?file=${fileName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setContent(data.content);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading markdown:', error);
        setError('コンテンツの読み込みに失敗しました。後でもう一度お試しください。');
        setLoading(false);
      });
  }, [fileName]);

  // エモジの表示を改善するための処理
  const enhanceEmoji = (htmlContent) => {
    if (!htmlContent) return '';
    
    // エモジを含むh1, h2, h3タグを処理
    const enhancedContent = htmlContent.replace(
      /(<h[1-3][^>]*>)(.*?)(🎨|🚀|🌟|✨|💡|🎭|🎪|📸|🎨|🛠|📷|💫|📚|🌅|👗|⚡|🔗|🖼️|📝|🎯|⚡|🎭|💫|🎯|🔮)(.*?)(<\/h[1-3]>)/g,
      (match, openTag, beforeEmoji, emoji, afterEmoji, closeTag) => {
        return `${openTag}<span class="emoji">${emoji}</span>${beforeEmoji}${afterEmoji}${closeTag}`;
      }
    );
    
    return enhancedContent;
  };

  // 読み込み中の表示
  if (loading) {
    return (
      <div className="markdown-container flex items-center justify-center py-12">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className="markdown-container">
        <div className="markdown-caution">
          <h2>エラーが発生しました</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="markdown-container">
      {title && <h1 className="page-title">{title}</h1>}
      {subtitle && <p className="page-subtitle text-lg text-gray-600 mb-8">{subtitle}</p>}
      
      <div className="markdown-content">
        <div dangerouslySetInnerHTML={{ __html: enhanceEmoji(content) }} />
      </div>
      
      <div className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-gray-500 text-sm">最終更新: {new Date().toLocaleDateString('ja-JP')}</p>
      </div>
    </div>
  );
} 