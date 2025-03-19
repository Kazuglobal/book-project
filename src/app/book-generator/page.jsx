import BookCoverGenerator from '../../components/BookCoverGenerator';

export const metadata = {
  title: '表紙ジェネレーター',
  description: '本の表紙を生成するツール',
};

export default function BookGeneratorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">本の表紙を生成</h1>
      <p className="text-center mb-8 max-w-2xl mx-auto">
        オリジナルの本の表紙を生成できます。
        タイトル、著者名、ジャンル、スタイルを入力して、美しい表紙画像と本の要約を作成します。
      </p>
      
      <BookCoverGenerator />
      
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>このツールはGoogle Gemini APIを使用しています。</p>
        <p>生成された画像と要約はAIによって作成されたものであり、実際の本や著作物とは関係ありません。</p>
      </div>
    </div>
  );
} 