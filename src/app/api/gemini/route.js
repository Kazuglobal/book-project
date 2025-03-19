import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 環境変数からAPIキーを取得
const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// デバッグのためのログ出力
console.log('GEMINI_API_KEY exists:', Boolean(process.env.GEMINI_API_KEY));
console.log('NEXT_PUBLIC_GEMINI_API_KEY exists:', Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY));
console.log('API_KEY length:', API_KEY.length);

// APIキーが設定されているか確認
if (!API_KEY || API_KEY.trim() === '' || API_KEY === 'YOUR_API_KEY_HERE') {
  console.error('APIキーが正しく設定されていません');
} else {
  console.log('API key appears to be configured correctly');
}

// Gemini APIクライアントの初期化
let genAI = null;
try {
  if (API_KEY && API_KEY.trim() !== '' && API_KEY !== 'YOUR_API_KEY_HERE') {
    genAI = new GoogleGenerativeAI(API_KEY);
    console.log('Gemini API client initialized successfully');
  } else {
    console.error('APIキーが設定されていないためGemini APIクライアントを初期化できません');
  }
} catch (error) {
  console.error('Failed to initialize Gemini API client:', error);
}

export async function POST(request) {
  try {
    console.log('POST request received');
    
    // APIキーのデバッグ情報を再度出力
    console.log('API_KEY validity check (POST):', Boolean(API_KEY && API_KEY.trim() !== '' && API_KEY !== 'YOUR_API_KEY_HERE'));
    console.log('genAI initialized check:', Boolean(genAI));
    
    // APIキーが設定されていない場合はエラーを返す
    if (!API_KEY || API_KEY.trim() === '' || API_KEY === 'YOUR_API_KEY_HERE' || !genAI) {
      console.error('API key validation failed in POST request');
      return NextResponse.json(
        { 
          error: 'API key is not configured correctly. Please set the GEMINI_API_KEY and NEXT_PUBLIC_GEMINI_API_KEY environment variables with valid keys.',
          apiKeyStatus: {
            apiKeyExists: Boolean(API_KEY),
            apiKeyEmpty: API_KEY.trim() === '',
            genAIInitialized: Boolean(genAI)
          }
        },
        { status: 500 }
      );
    }

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
      { error: `リクエスト処理中にエラーが発生しました: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * Gemini APIを使用して本の表紙画像を生成する関数
 */
async function generateBookCover(prompt, bookTitle, author) {
  try {
    // 最新の画像生成モデルを選択
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ['Text', 'Image']
      }
    });

    // プロンプトの作成
    const fullPrompt = `Create a book cover image for a book titled "${bookTitle}" by ${author}. ${prompt}. Please generate an image.`;

    // 画像生成リクエストの設定
    const response = await model.generateContent(fullPrompt);
    
    // レスポンスから画像データを抽出
    let imageUrl = null;
    let description = null;
    
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        imageUrl = `data:image/jpeg;base64,${imageData}`;
      } else if (part.text) {
        description = part.text;
      }
    }
    
    if (imageUrl) {
      return NextResponse.json({ 
        imageUrl,
        description: description || "Generated image"
      });
    } else {
      // 画像が生成されなかった場合はテキスト説明のみを返す
      return NextResponse.json({ 
        message: "画像生成はサポートされていません。代わりに説明テキストを生成しました。",
        summary: description || "画像の説明を生成できませんでした。"
      });
    }
  } catch (error) {
    console.error('Error generating book cover:', error);
    return NextResponse.json(
      { error: '画像生成中にエラーが発生しました: ' + error.message },
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
    const model = genAI.getGenerativeModel({ 
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
      { error: '要約生成中にエラーが発生しました: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * Gemini APIを使用して本のページ画像を生成する関数
 */
async function generatePageImage(prompt, pageStyle, pageContent) {
  try {
    // 最新の画像生成モデルを選択
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ['Text', 'Image']
      }
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
    const fullPrompt = `${stylePrompt} ${prompt} ${contentContext}. Please generate an image.`;

    // 画像生成リクエストの設定
    const response = await model.generateContent(fullPrompt);
    
    // レスポンスから画像データを抽出
    let imageUrl = null;
    let description = null;
    
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        imageUrl = `data:image/jpeg;base64,${imageData}`;
      } else if (part.text) {
        description = part.text;
      }
    }
    
    if (imageUrl) {
      return NextResponse.json({ 
        imageUrl,
        description: description || "Generated image"
      });
    } else {
      // 画像が生成されなかった場合はダミー画像とテキスト説明を返す
      return NextResponse.json({ 
        imageUrl: "https://placehold.co/600x400/orange/white?text=Generated+Image+Placeholder",
        description: description || "画像の説明を生成できませんでした。",
        message: "画像生成はサポートされていません。代わりにプレースホルダー画像と説明テキストを生成しました。"
      });
    }
  } catch (error) {
    console.error('Error generating page image:', error);
    return NextResponse.json(
      { error: '画像生成中にエラーが発生しました: ' + error.message },
      { status: 500 }
    );
  }
}