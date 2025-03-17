import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { remark } from 'remark';
import html from 'remark-html';

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
    
    // マークダウンをHTMLに変換
    const processedContent = await remark()
      .use(html)
      .process(fileContent);
    const contentHtml = processedContent.toString();
    
    return NextResponse.json({ content: contentHtml });
  } catch (error) {
    console.error('Error processing markdown:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 