'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';

// 環境変数からAPIキーを取得
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// APIキーが設定されているか確認
const isValidApiKey = Boolean(API_KEY && API_KEY !== 'YOUR_API_KEY_HERE');

// Gemini APIクライアントの初期化
let genAI = null;
try {
  if (isValidApiKey) {
    genAI = new GoogleGenerativeAI(API_KEY);
    console.log('Gemini API client initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Gemini API client:', error);
}

export { genAI, isValidApiKey };

// APIキーが設定されていない場合のエラーメッセージを返す関数
export function getApiKeyErrorMessage() {
  if (!API_KEY) {
    return 'Gemini APIキーが設定されていません。.env.localファイルにNEXT_PUBLIC_GEMINI_API_KEYを設定してください。';
  }
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    return 'Gemini APIキーがプレースホルダーのままです。有効なAPIキーを.env.localファイルに設定してください。';
  }
  return null;
}

/**
 * Gemini APIを使用して本の表紙画像を生成する関数
 * @param {string} prompt - 画像生成のためのプロンプト
 * @param {string} bookTitle - 本のタイトル
 * @param {string} author - 著者名
 * @returns {Promise<string>} - 生成された画像のBase64エンコードされたデータURL
 */
export async function generateBookCover(prompt, bookTitle, author) {
  if (!isValidApiKey || !genAI) {
    throw new Error('有効なGemini APIキーが設定されていません');
  }

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
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        return `data:image/jpeg;base64,${imageData}`;
      }
    }
    
    // 画像が生成されなかった場合はエラーをスロー
    throw new Error('画像の生成に失敗しました。別のプロンプトを試してください。');
  } catch (error) {
    console.error('Error generating book cover:', error);
    throw error;
  }
}

/**
 * Gemini APIを使用して本の内容の要約を生成する関数
 * @param {string} bookTitle - 本のタイトル
 * @param {string} genre - 本のジャンル
 * @returns {Promise<string>} - 生成された本の要約
 */
export async function generateBookSummary(bookTitle, genre) {
  if (!isValidApiKey || !genAI) {
    throw new Error('有効なGemini APIキーが設定されていません');
  }

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
    return result.response.text();
  } catch (error) {
    console.error('Error generating book summary:', error);
    throw error;
  }
} 