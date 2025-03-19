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
    // 安全なプロンプトを作成
    const safePrompt = prompt.replace(/[^\w\s.,!?:;\-()]/g, '');
    
    // プロンプトを生成
    const imagePrompt = `Create a beautiful book cover for "${bookTitle}" by ${author}. ${safePrompt}`;
    
    console.log('Sending request to Gemini API for book cover generation with prompt:', imagePrompt);

    try {
      // Gemini APIクライアントを再初期化
      const freshGenAI = new GoogleGenerativeAI(API_KEY);
      
      // 最新のGemini APIエンドポイントを使用して画像生成を試みる
      const model = freshGenAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: ['Text', 'Image']
        }
      });
      
      const response = await model.generateContent(imagePrompt);
      console.log('Received response from Gemini API:', JSON.stringify(response, null, 2));
      
      // レスポンスから画像データを抽出
      let imageUrl = null;
      let textResponse = null;
      
      if (response && response.response && 
          response.response.candidates && 
          response.response.candidates.length > 0) {
        
        // SAFETY または他のfinishReasonをチェック
        const finishReason = response.response.candidates[0].finishReason;
        if (finishReason === 'IMAGE_SAFETY' || finishReason === 'SAFETY' || finishReason === 'RECITATION') {
          throw new Error(`画像生成がブロックされました: ${finishReason}`);
        }
        
        if (response.response.candidates[0].content &&
            response.response.candidates[0].content.parts) {
          const parts = response.response.candidates[0].content.parts;
          
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            } else if (part.text) {
              textResponse = part.text;
            }
          }
        }
      }
      
      if (imageUrl) {
        return NextResponse.json({ 
          imageUrl,
          description: textResponse || "Generated with Gemini"
        });
      } else {
        // 画像生成に失敗した場合
        const finishReason = response && 
                            response.response &&
                            response.response.candidates && 
                            response.response.candidates.length > 0 && 
                            response.response.candidates[0].finishReason;
        
        let errorMessage;
        if (finishReason === 'SAFETY' || finishReason === 'IMAGE_SAFETY') {
          errorMessage = '安全性フィルターによりブロックされました。プロンプトを変更して再試行してください。';
        } else if (finishReason === 'RECITATION') {
          errorMessage = 'コンテンツポリシー違反が検出されました。別のプロンプトをお試しください。';
        } else {
          errorMessage = '画像生成に失敗しました。別のプロンプトをお試しください。';
        }
        
        console.warn('Gemini API error or no image returned:', errorMessage, 'Finish reason:', finishReason);
        
        // テキスト生成でカバーする
        const textGenAI = new GoogleGenerativeAI(API_KEY);
        const textModel = textGenAI.getGenerativeModel({ 
          model: "gemini-1.5-flash" 
        });
        
        const descriptionPrompt = `Describe in detail what a book cover for "${bookTitle}" by ${author} would look like. ${safePrompt}`;
        
        const textResult = await textModel.generateContent({
          contents: [{ role: "user", parts: [{ text: descriptionPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        });
        
        const coverDescription = textResult.response.text();
        
        // プレースホルダー画像を生成
        const placeholderUrl = generatePlaceholderImage(bookTitle, author);
        
        return NextResponse.json({ 
          imageUrl: placeholderUrl,
          message: `${errorMessage} 代わりに説明テキストを生成しました。`,
          summary: coverDescription || textResponse,
          finishReason: finishReason
        });
      }
    } catch (imageError) {
      console.error('Gemini Image API error:', imageError);
      
      // 画像生成APIが失敗した場合は、代わりに通常のGemini APIでテキスト生成を試みる
      console.log('Falling back to Gemini text generation for cover description');
      
      // 新しいAPIクライアントを初期化
      const fallbackGenAI = new GoogleGenerativeAI(API_KEY);
      const model = fallbackGenAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
      });
      
      const descriptionPrompt = `Describe in detail what a book cover for "${bookTitle}" by ${author} would look like. ${safePrompt}`;
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: descriptionPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });
      
      const coverDescription = result.response.text();
      
      // プレースホルダー画像を生成
      const placeholderUrl = generatePlaceholderImage(bookTitle, author);
      
      return NextResponse.json({ 
        imageUrl: placeholderUrl,
        message: "画像生成の処理中にエラーが発生しました。代わりに説明テキストを生成しました。",
        summary: coverDescription,
        error: imageError.message
      });
    }
  } catch (error) {
    console.error('Error generating book cover:', error);
    
    // エラー時にもプレースホルダー画像を生成
    const placeholderUrl = generatePlaceholderImage(bookTitle, author);
    
    return NextResponse.json(
      { 
        error: '画像生成中にエラーが発生しました: ' + error.message,
        stack: error.stack,
        imageUrl: placeholderUrl,
        message: "エラーが発生しましたが、プレースホルダー画像を生成しました。"
      },
      { status: 200 } // エラーでも200を返して、フロントエンドでプレースホルダーを表示
    );
  }
}

/**
 * シンプルなプレースホルダー画像URLを生成する関数
 */
function generatePlaceholderImage(title, author) {
  // タイトルと著者名をURLエンコード
  const encodedTitle = encodeURIComponent(title);
  const encodedAuthor = encodeURIComponent(author);
  
  // 色をランダムに生成
  const colors = ['1e88e5', '43a047', 'e53935', '5e35b1', 'fb8c00', '546e7a', '6d4c41', '00acc1'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomBgColor = '212121';
  
  // プレースホルダー画像URL
  return `https://placehold.co/800x1200/${randomColor}/${randomBgColor}?text=${encodedTitle}%0Aby%0A${encodedAuthor}&font=playfair`;
}

/**
 * Gemini APIを使用して本の内容の要約を生成する関数
 */
async function generateBookSummary(bookTitle, genre) {
  try {
    // Gemini APIクライアントを再初期化
    const freshGenAI = new GoogleGenerativeAI(API_KEY);
    
    // モデルの選択
    const model = freshGenAI.getGenerativeModel({ 
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
    // 安全なプロンプトを作成
    const safePrompt = prompt ? prompt.replace(/[^\w\s.,!?:;\-()]/g, '') : '';
    const safeContent = pageContent ? pageContent.replace(/[^\w\s.,!?:;\-()]/g, '') : '';
    
    // スタイルに基づいたプロンプト補強
    let styleDescription = '';
    switch (pageStyle) {
      case 'novel':
        styleDescription = 'elegant illustration for a novel with a clean design';
        break;
      case 'manga':
        styleDescription = 'manga style illustration with clear line art';
        break;
      case 'children':
        styleDescription = 'colorful and whimsical illustration for a children\'s book';
        break;
      case 'technical':
        styleDescription = 'clear diagram or infographic for a technical book';
        break;
      default:
        styleDescription = 'book illustration';
    }
    
    // イメージ生成用のプロンプトを作成
    const imagePrompt = `Create a ${styleDescription}${safeContent ? ` about "${safeContent.substring(0, 50)}"` : ''}${safePrompt ? `. Details: ${safePrompt}` : ''}`;
    
    console.log('Sending request to Gemini API for page illustration generation with prompt:', imagePrompt);

    try {
      // Gemini APIクライアントを再初期化
      const freshGenAI = new GoogleGenerativeAI(API_KEY);
      
      // 最新のGemini APIエンドポイントを使用して画像生成を試みる
      const model = freshGenAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: ['Text', 'Image']
        }
      });
      
      const response = await model.generateContent(imagePrompt);
      console.log('Received response from Gemini API:', JSON.stringify(response, null, 2));
      
      // レスポンスから画像データを抽出
      let imageUrl = null;
      let textResponse = null;
      
      if (response && response.response && 
          response.response.candidates && 
          response.response.candidates.length > 0) {
        
        // SAFETY または他のfinishReasonをチェック
        const finishReason = response.response.candidates[0].finishReason;
        if (finishReason === 'IMAGE_SAFETY' || finishReason === 'SAFETY' || finishReason === 'RECITATION') {
          throw new Error(`画像生成がブロックされました: ${finishReason}`);
        }
        
        if (response.response.candidates[0].content &&
            response.response.candidates[0].content.parts) {
          const parts = response.response.candidates[0].content.parts;
          
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            } else if (part.text) {
              textResponse = part.text;
            }
          }
        }
      }
      
      if (imageUrl) {
        return NextResponse.json({ 
          imageUrl,
          description: textResponse || "Generated with Gemini"
        });
      } else {
        // 画像生成に失敗した場合
        const finishReason = response && 
                            response.response &&
                            response.response.candidates && 
                            response.response.candidates.length > 0 && 
                            response.response.candidates[0].finishReason;
        
        let errorMessage;
        if (finishReason === 'SAFETY' || finishReason === 'IMAGE_SAFETY') {
          errorMessage = '安全性フィルターによりブロックされました。プロンプトを変更して再試行してください。';
        } else if (finishReason === 'RECITATION') {
          errorMessage = 'コンテンツポリシー違反が検出されました。別のプロンプトをお試しください。';
        } else {
          errorMessage = '画像生成に失敗しました。別のプロンプトをお試しください。';
        }
        
        console.warn('Gemini API error or no image returned:', errorMessage, 'Finish reason:', finishReason);
        
        // テキスト生成でカバーする
        const textGenAI = new GoogleGenerativeAI(API_KEY);
        const textModel = textGenAI.getGenerativeModel({ 
          model: "gemini-1.5-flash" 
        });
        
        const descriptionPrompt = `Describe in detail what a ${styleDescription} about "${safeContent}" would look like. ${safePrompt}`;
        
        const textResult = await textModel.generateContent({
          contents: [{ role: "user", parts: [{ text: descriptionPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        });
        
        const pageDescription = textResult.response.text();
        
        // プレースホルダー画像を生成
        const placeholderUrl = generatePlaceholderContent(pageStyle, safeContent);
        
        return NextResponse.json({ 
          imageUrl: placeholderUrl,
          message: `${errorMessage} 代わりに説明テキストを生成しました。`,
          description: pageDescription || textResponse,
          finishReason: finishReason
        });
      }
    } catch (imageError) {
      console.error('Gemini Image API error:', imageError);
      
      // 画像生成APIが失敗した場合は、代わりに通常のGemini APIでテキスト生成を試みる
      console.log('Falling back to Gemini text generation for page description');
      
      // 新しいAPIクライアントを初期化
      const fallbackGenAI = new GoogleGenerativeAI(API_KEY);
      const model = fallbackGenAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
      });
      
      const descriptionPrompt = `Describe in detail what a ${styleDescription} for a book page about "${safeContent}" would look like. ${safePrompt}`;
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: descriptionPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });
      
      const pageDescription = result.response.text();
      
      // プレースホルダー画像を生成
      const placeholderUrl = generatePlaceholderContent(pageStyle, safeContent);
      
      return NextResponse.json({ 
        imageUrl: placeholderUrl,
        message: "画像生成の処理中にエラーが発生しました。代わりに説明テキストを生成しました。",
        description: pageDescription,
        error: imageError.message
      });
    }
  } catch (error) {
    console.error('Error generating page image:', error);
    
    // エラー時にもプレースホルダー画像を生成
    const placeholderUrl = generatePlaceholderContent(pageStyle, pageContent);
    
    return NextResponse.json(
      { 
        error: '画像生成中にエラーが発生しました: ' + error.message,
        stack: error.stack,
        imageUrl: placeholderUrl,
        message: "エラーが発生しましたが、プレースホルダー画像を生成しました。"
      },
      { status: 200 } // エラーでも200を返して、フロントエンドでプレースホルダーを表示
    );
  }
}

/**
 * シンプルなプレースホルダーコンテンツ画像を生成する関数
 */
function generatePlaceholderContent(style, content) {
  // スタイルに適した色を選択
  let color = '1e88e5'; // デフォルト青
  let bgColor = 'f5f5f5';
  let textContent = content ? content.substring(0, 50) : 'Book Page Illustration';
  
  switch (style) {
    case 'novel':
      color = '546e7a'; // グレー
      bgColor = 'fffde7'; // 明るいベージュ
      break;
    case 'manga':
      color = '212121'; // 黒
      bgColor = 'ffffff'; // 白
      break;
    case 'children':
      color = 'fb8c00'; // オレンジ
      bgColor = 'e3f2fd'; // 明るい青
      break;
    case 'technical':
      color = '0097a7'; // ティール
      bgColor = 'f5f5f5'; // グレー
      break;
  }
  
  // コンテンツ内容をエンコード
  const encodedText = encodeURIComponent(textContent);
  
  // プレースホルダー画像URL
  return `https://placehold.co/600x400/${color}/${bgColor}?text=${encodedText}&font=roboto`;
}