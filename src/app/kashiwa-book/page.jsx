import KashiwaBookPage from '../../components/KashiwaBookPage';

export const metadata = {
  title: '柏の葉の不思議な一日',
  description: '千葉県柏市柏の葉を舞台にした子供向け絵本',
};

export default function KashiwaBookPageContainer() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-4">柏の葉の不思議な一日</h1>
      <p className="text-center mb-8 max-w-2xl mx-auto">
        千葉県柏市柏の葉を舞台にした子供向け絵本です。
        柏の葉の魅力的な場所を巡りながら、この地域の特徴を楽しく学べます。
        Gemini APIを使用して生成されたイラストで、柏の葉の風景を視覚的に体験できます。
      </p>
      
      <KashiwaBookPage />
      
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>このコンテンツは千葉県柏市柏の葉で作成された絵本プロジェクトの一部です。</p>
        <p>生成された画像はAIによって作成されたものであり、実際の風景とは異なる場合があります。</p>
      </div>
    </div>
  );
} 