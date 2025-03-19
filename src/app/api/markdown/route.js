import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

// 特殊なスタイリングを適用する関数
function enhanceHtml(htmlContent) {
  if (!htmlContent) return '';
  
  let enhancedContent = htmlContent;
  
  // エモジを含む見出しの処理
  enhancedContent = enhancedContent.replace(
    /<h([1-3])[^>]*>(.*?)(🎨|🚀|🌟|✨|💡|🎭|🎪|📸|🎨|🛠|📷|💫|📚|🌅|👗|⚡|🔗|🖼️|📝|🎯|⚡|🎭|💫|🎯|🔮)(.*?)<\/h([1-3])>/g,
    (match, level1, beforeEmoji, emoji, afterEmoji, level2) => {
      if (level1 !== level2) return match;
      return `<h${level1}><span class="emoji">${emoji}</span> ${beforeEmoji}${afterEmoji}</h${level1}>`;
    }
  );
  
  // リスト項目のスタイル強化
  enhancedContent = enhancedContent.replace(
    /<li>(.*?)<code>(.*?)<\/code>(.*?)<\/li>/g,
    '<li class="feature-item"><span class="code-highlight">$2</span>$1$3</li>'
  );
  
  // コードブロックにシンタックスハイライトのためのクラスを追加
  enhancedContent = enhancedContent.replace(
    /<pre><code>(```[a-z]*\n)?(.*?)(<\/code><\/pre>)/gs,
    (match, lang, code, end) => {
      const language = lang ? lang.replace(/```([a-z]*)\n/, '$1') : '';
      const langClass = language ? ` class="language-${language}"` : '';
      return `<pre${langClass}><code${langClass}>${code}${end}`;
    }
  );
  
  // セクションのカード化処理
  enhancedContent = enhancedContent.replace(
    /<h3>(.*?)<\/h3>\s*<ul>([\s\S]*?)<\/ul>/g,
    '<div class="markdown-card"><h3>$1</h3><ul>$2</ul></div>'
  );
  
  // ヒントセクションの処理
  enhancedContent = enhancedContent.replace(
    /<h2>([^<]*?)ヒント([^<]*?)<\/h2>([\s\S]*?)(?=<h2>|$)/g,
    '<div class="markdown-tips"><h2>$1ヒント$2</h2>$3</div>'
  );
  
  return enhancedContent;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    
    if (!fileName) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 });
    }
    
    // ファイルパスを構築（セキュリティのためにパスを検証）
    const safeFileName = fileName.replace(/[^a-zA-Z0-9-]/g, '');
    const filePath = path.join(process.cwd(), `src/docs/${safeFileName}.md`);
    
    // ファイルが存在するか確認
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // マークダウンファイルを読み込む
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // マークダウンをHTMLに変換（GitHub Flavored Markdownサポート追加）
    const processedContent = await remark()
      .use(remarkGfm) // GitHub Flavored Markdownのサポート
      .use(html, { sanitize: false }) // 生のHTMLを許可
      .process(fileContent);
    
    let contentHtml = processedContent.toString();
    
    // HTMLを強化
    contentHtml = enhanceHtml(contentHtml);
    
    return NextResponse.json({ content: contentHtml });
  } catch (error) {
    console.error('Error processing markdown:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 