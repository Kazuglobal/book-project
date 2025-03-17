import { genai } from '@google/generative-ai';

// APIキーを環境変数から取得するか、直接設定します
// 注意: 実際のプロダクションでは環境変数を使用することを強く推奨します
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBkcTpM5FKvx_WrFIo4g6O9fHS-G6rjjnA';

// Gemini APIクライアントの初期化
const genaiClient = genai.configure({
  apiKey: API_KEY,
});

/**
 * Gemini APIを使用して本の表紙画像を生成する関数
 * @param {string} prompt - 画像生成のためのプロンプト
 * @param {string} bookTitle - 本のタイトル
 * @param {string} author - 著者名
 * @returns {Promise<string>} - 生成された画像のBase64エンコードされたデータURL
 */
export async function generateBookCover(prompt, bookTitle, author) {
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
    return `data:image/jpeg;base64,${imageData}`;
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
    return result.response.text();
  } catch (error) {
    console.error('Error generating book summary:', error);
    throw error;
  }
} 