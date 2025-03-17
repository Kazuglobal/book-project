import { NextResponse } from 'next/server';
import { genai } from '@google/generative-ai';

// APIキーを環境変数から取得するか、直接設定します
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBkcTpM5FKvx_WrFIo4g6O9fHS-G6rjjnA';

// Gemini APIクライアントの初期化
const genaiClient = genai.configure({
  apiKey: API_KEY,
});

export async function POST(request) {
  try {
    const { action, prompt, bookTitle, author, genre, pageStyle, pageContent } = await request.json();

    if (action === 'generateCover') {
      // 本の表紙画像を生成
      return await generateBookCover(prompt, bookTitle, author);
    } else if (action === 'generateSummary') {
      // 本の要約を生成
      return await generateBookSummary(bookTitle, genre);
    } else if (action === 'generatePageImage') {
      // 本のページ画像を生成
      return await generatePageImage(prompt, pageStyle, pageContent);
    } else {
      return NextResponse.json(
        { error: '無効なアクション' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'リクエスト処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * Gemini APIを使用して本の表紙画像を生成する関数
 */
async function generateBookCover(prompt, bookTitle, author) {
  try {
    // モデルの選択
    const model = genaiClient.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation" 
    });

    // プロンプトの作成
    const fullPrompt = `Create a book cover image for a book titled "${bookTitle}" by ${author}. ${prompt}`;

    // 画像生成リクエストの設定
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
      ],
    });

    // 生成された画像を取得
    const response = result.response;
    const imageData = response.candidates[0].content.parts[0].inlineData.data;
    
    // Base64エンコードされた画像データを返す
    return NextResponse.json({ imageUrl: `data:image/jpeg;base64,${imageData}` });
  } catch (error) {
    console.error('Error generating book cover:', error);
    return NextResponse.json(
      { error: '画像生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * Gemini APIを使用して本の内容の要約を生成する関数
 */
async function generateBookSummary(bookTitle, genre) {
  try {
    // モデルの選択
    const model = genaiClient.getGenerativeModel({ 
      model: "gemini-2.0-flash" 
    });

    // プロンプトの作成
    const prompt = `Create a short summary for a ${genre} book titled "${bookTitle}". The summary should be engaging and approximately 150-200 words.`;

    // テキスト生成リクエストの設定
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // 生成されたテキストを返す
    return NextResponse.json({ summary: result.response.text() });
  } catch (error) {
    console.error('Error generating book summary:', error);
    return NextResponse.json(
      { error: '要約生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * Gemini APIを使用して本のページ画像を生成する関数
 */
async function generatePageImage(prompt, pageStyle, pageContent) {
  try {
    // モデルの選択
    const model = genaiClient.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation" 
    });

    // ページスタイルに基づいたプロンプトの調整
    let stylePrompt = '';
    switch (pageStyle) {
      case 'novel':
        stylePrompt = 'Create an elegant, atmospheric illustration for a novel page. The style should be subtle and evocative.';
        break;
      case 'manga':
        stylePrompt = 'Create a manga-style illustration with dynamic composition and expressive characters.';
        break;
      case 'children':
        stylePrompt = 'Create a colorful, whimsical illustration for a children\'s book. The style should be friendly and engaging.';
        break;
      case 'technical':
        stylePrompt = 'Create a clean, informative diagram or illustration for a technical book. Include relevant visual elements that explain concepts.';
        break;
      default:
        stylePrompt = 'Create a simple, clean illustration for a book page.';
    }

    // コンテンツに基づいたコンテキストの追加
    const contentContext = pageContent ? `The illustration should relate to this content: "${pageContent}"` : '';

    // プロンプトの作成
    const fullPrompt = `${stylePrompt} ${prompt} ${contentContext}`;

    // 画像生成リクエストの設定
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
      ],
    });

    // 生成された画像を取得
    const response = result.response;
    const imageData = response.candidates[0].content.parts[0].inlineData.data;
    
    // Base64エンコードされた画像データを返す
    return NextResponse.json({ imageUrl: `data:image/jpeg;base64,${imageData}` });
  } catch (error) {
    console.error('Error generating page image:', error);
    return NextResponse.json(
      { error: '画像生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 