# 🚀 Gemini API マスターガイド

## 🎨 クリエイティブイメージング

Gemini 2.0 Flash Experimentalは、あなたのクリエイティブな表現を次のレベルへと導く革新的なツールです。
テキストと画像を自在に操り、以下のような魅力的なコンテンツを生み出すことができます：

- 🖼️ インタラクティブな画像編集
- 📝 テキストと画像が織りなすストーリーテリング
- 🎯 目的に合わせた画像生成

生成されるすべての画像には、SynthIDの透かしが埋め込まれ、Google AI Studioの画像には目に見えない透かしも含まれます。

## ⚡ クイックスタート

### 🎯 基本的な画像生成

以下のコードで、あなたのアイデアを視覚化できます：

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// 🔑 APIクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function createMagic() {
  // ✨ クリエイティブなプロンプト
  const vision = "Create a whimsical scene of a magical library where books " +
                "float in the air, surrounded by soft, glowing lights and " +
                "mysterious magical elements.";

  // 🎨 モデルの設定
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
        responseModalities: ['Text', 'Image']
    },
  });

  try {
    // 🚀 画像生成
    const response = await model.generateContent(vision);
    
    // 📦 結果の処理
    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        console.log("💭 生成メッセージ:", part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');
        fs.writeFileSync('magical-creation.png', buffer);
        console.log('✨ 画像を保存しました: magical-creation.png');
      }
    }
  } catch (error) {
    console.error("🚨 エラー:", error);
  }
}

createMagic();
```

### 🎭 画像編集の魔法

既存の画像に新しい魔法を吹き込むことができます：

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// 🔑 APIクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function transformImage() {
    // 📸 画像の準備
    const imagePath = 'path/to/your/image.png';
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    // 🎨 コンテンツの構成
    const contents = [
        { text: "この写真に魔法のような雰囲気を加えて、夕暮れの光と妖精のような光の粒を散りばめてください" },
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image
          }
        }
    ];

    // ✨ モデルの設定
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
            responseModalities: ['Text', 'Image']
        },
    });

    try {
        // 🚀 変換の実行
        const response = await model.generateContent(contents);
        
        // 📦 結果の保存
        for (const part of response.response.candidates[0].content.parts) {
            if (part.text) {
                console.log("💭 生成メッセージ:", part.text);
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const buffer = Buffer.from(imageData, 'base64');
                fs.writeFileSync('magical-transformation.png', buffer);
                console.log('✨ 変換された画像を保存しました: magical-transformation.png');
            }
        }
    } catch (error) {
        console.error("🚨 エラー:", error);
    }
}

transformImage();
```

## 💫 プロフェッショナルTips

### 🎯 最適なパフォーマンスのために

- 📝 サポートされている言語を使用
  - EN（英語）
  - ja-JP（日本語）
  - es-MX（スペイン語）
  - zh-CN（中国語）
  - hi-IN（ヒンディー語）

### 🎨 画像生成のコツ

1. **明確な指示**
   - 具体的なビジョンを伝える
   - 重要な要素を優先順位付け

2. **創造性の引き出し方**
   - 画像生成を明示的に指示
   - 複数のアプローチを試す

3. **エラー対応**
   - エラーメッセージを確認
   - プロンプトの調整を試みる

## 🔮 次のステップ

- 📚 [プロンプトクラフティングガイド](https://ai.google.dev/gemini-api/docs/imagen-prompt-guide)で表現力を磨く
- 🚀 [Geminiモデルガイド](https://ai.google.dev/gemini-api/docs/models)で可能性を広げる
- 💡 [API公式ドキュメント](https://ai.google.dev/gemini-api/docs)で最新情報をキャッチ 