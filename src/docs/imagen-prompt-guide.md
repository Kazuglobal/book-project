# Imagen プロンプトガイド

## プロンプト作成の基本

Gemini 2.0 Flash Experimental を使用して画像を生成する際は、適切なプロンプトを作成することが重要です。プロンプトとは、生成したい画像の内容を説明するテキストです。効果的なプロンプトは以下の3つの要素で構成されます：

1. **主題** - 何を生成したいか
2. **コンテキスト** - どのような状況や背景か
3. **スタイル** - どのような見た目や雰囲気にしたいか

## プロンプト作成のヒント

### 短いプロンプトと長いプロンプト

Imagen 3は、短いプロンプトでも長いプロンプトでも対応できます：

- **短いプロンプト**: 画像をすばやく生成したい場合に適しています
  - 例: `20代の女性のクローズアップ写真, ストリート写真, 映画のワンシーン, 落ち着いたオレンジの暖色調`

- **長いプロンプト**: より具体的な詳細を追加したい場合に適しています
  - 例: `ストリートフォトスタイルを活用した20代の女性の魅力的な写真。画像は、オレンジ色の暖色系の落ち着いた色調にし、映画のワンシーンのように見えるようにする必要があります。`

### 効果的なプロンプト作成のためのヒント

1. **わかりやすい表現を使用する**
   - 具体的な形容詞や副詞を使用して、明確な画像を描きます

2. **コンテキストを提供する**
   - 必要に応じて、AIの理解を助けるために背景情報を含めます

3. **特定のアーティストやスタイルを参照する**
   - 特定の美学を念頭に置いている場合は、特定のアーティストや芸術運動を参照すると役に立ちます

4. **画像内のテキストを生成する場合**
   - テキストを明確に指定し、短く簡潔にします

5. **個人写真やグループ写真の顔の細部を補正する**
   - 写真の焦点として顔の詳細を指定します（例：プロンプトで「ポートレート」という単語を使用）

## スタイルの指定

### 写真スタイル

写真のような画像を生成する場合は、以下のようなスタイル指定が効果的です：

- `ポートレート写真`
- `風景写真`
- `ストリート写真`
- `マクロ写真`
- `航空写真`
- `水中写真`

### イラストとアートスタイル

イラストやアート作品を生成する場合は、以下のようなスタイル指定が効果的です：

- `水彩画`
- `油絵`
- `デジタルアート`
- `漫画スタイル`
- `ピクセルアート`
- `3Dレンダリング`

## 高度なプロンプト作成手法

### 写真の修飾子

写真のような画像を生成する場合は、以下のような修飾子を追加すると効果的です：

- カメラの種類: `一眼レフカメラで撮影`
- レンズの種類: `広角レンズ`, `マクロレンズ`
- 照明条件: `自然光`, `スタジオ照明`, `夕暮れの光`
- 撮影技法: `ボケ効果`, `シャロー・フォーカス`, `ハイキー`

### 形状と素材

オブジェクトの形状や素材を指定すると、より具体的な画像を生成できます：

- 形状: `丸い`, `四角い`, `流線型の`
- 素材: `木製の`, `金属製の`, `ガラス製の`, `セラミック製の`

### 画像品質の修飾子

画像の品質を向上させるための修飾子：

- `高解像度`
- `詳細な`
- `シャープな`
- `4K`
- `8K`

### アスペクト比

特定のアスペクト比を指定したい場合は、プロンプトに含めることができます：

- `正方形のフォーマット`
- `ワイドスクリーンフォーマット`
- `縦長のフォーマット`

## 実践的なプロンプト例

### 本の表紙画像の生成

```
Create a book cover image for a fantasy novel titled "The Crystal Kingdom". The cover should feature a majestic crystal castle on a floating island, surrounded by clouds. Use a vibrant color palette with blues and purples. The style should be digital art with a magical atmosphere. Please include the title "The Crystal Kingdom" and author name "J.R. Morgan" in an elegant fantasy font.
```

### 風景画像の生成

```
A serene landscape photograph of a misty mountain lake at dawn. The mountains should be reflected in the still water. Soft morning light filtering through the mist. Shot with a wide-angle lens on a professional DSLR camera. High resolution, photorealistic quality.
```

### キャラクターイラストの生成

```
Create a manga-style illustration of a young female warrior with short blue hair and determined eyes. She's wearing a lightweight armor with silver and blue accents. She's holding a glowing sword and standing in a defensive pose. The background should show a Japanese-inspired fantasy city at night with cherry blossoms falling. Dynamic composition with dramatic lighting.
```

## 制限事項

- 最高のパフォーマンスを実現するには、EN、es-MX、ja-JP、zh-CN、hi-IN のいずれかの言語を使用してください
- 画像生成では、音声や動画の入力はサポートされていません
- 画像生成がトリガーされない場合は、以下を試してください：
  - 画像出力を明示的に指示する（例: 「画像を生成してください」、「作業時に画像を提供してください」）
  - 別のプロンプトを試す

## 参考リンク

- [Gemini API 公式ドキュメント](https://ai.google.dev/gemini-api/docs)
- [Imagen プロンプトガイド（公式）](https://ai.google.dev/gemini-api/docs/imagen-prompt-guide) 