# Gemini API ガイド

## 画像生成機能

Gemini 2.0 Flash Experimental は、テキストとインライン画像を出力する機能をサポートしています。これにより、以下のことが可能になります：

- 対話的な画像の編集
- テキストが織り込まれた出力の生成（1つのターンにテキストと画像を含むブログ投稿など）

生成されたすべての画像には SynthID の透かしが含まれ、Google AI Studio の画像には目に見えない透かしも含まれます。

## 基本的な画像生成

以下は、Gemini 2.0 を使用してテキストと画像の出力を生成する方法の例です。

### Node.js での実装例

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateImage() {
  const contents = "Hi, can you create a 3d rendered image of a pig " +
                  "with wings and a top hat flying over a happy " +
                  "futuristic scifi city with lots of greenery?";

  // Set responseModalities to include "Image" so the model can generate an image
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
        responseModalities: ['Text', 'Image']
    },
  });

  try {
    const response = await model.generateContent(contents);
    for (const part of response.response.candidates[0].content.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');
        fs.writeFileSync('gemini-native-image.png', buffer);
        console.log('Image saved as gemini-native-image.png');
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

generateImage();
```

## 画像編集機能

画像編集を行うには、画像を入力として追加します。以下は、base64 でエンコードされた画像のアップロードを示す例です。

### Node.js での実装例

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateImage() {
    // Load the image from the local file system
    const imagePath = '/path/to/image.png';
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    // Prepare the content parts
    const contents = [
        { text: "Hi, This is a picture of me. Can you add a llama next to me?" },
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image
          }
        }
      ];

  // Set responseModalities to include "Image" so the model can generate an image
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
        responseModalities: ['Text', 'Image']
    },
  });

  try {
    const response = await model.generateContent(contents);
    for (const part of response.response.candidates[0].content.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');
        fs.writeFileSync('gemini-native-image.png', buffer);
        console.log('Image saved as gemini-native-image.png');
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

generateImage();
```

## 制限事項

- 最高のパフォーマンスを実現するには、EN、es-MX、ja-JP、zh-CN、hi-IN のいずれかの言語を使用してください。
- 画像生成では、音声や動画の入力はサポートされていません。
- 画像生成がトリガーされない場合があります。
  - モデルがテキストのみを出力する場合があります。画像出力を明示的に指示してみてください（例: 「画像を生成してください」、「作業時に画像を提供してください」、「画像を更新してください」）。
  - モデルの生成が途中で停止することがあります。もう一度お試しいただくか、別のプロンプトをお試しください。

## サポートされている入力テキスト言語

- 英語（`en`）

## 次のステップ

- Imagen のプロンプトの作成方法については、[Imagen プロンプト ガイド](https://ai.google.dev/gemini-api/docs/imagen-prompt-guide)をご覧ください。
- Gemini 2.0 モデルの詳細については、[Gemini モデルと試験運用版モデル](https://ai.google.dev/gemini-api/docs/models)をご覧ください。 