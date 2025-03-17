import BookPageDesigner from '../../components/BookPageDesigner';

export const metadata = {
  title: '本のページデザイナー',
  description: 'Gemini APIを使用して本のページをデザインするツール',
};

export default function BookPageDesignerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">本のページデザイナー</h1>
      <p className="text-center mb-8 max-w-2xl mx-auto">
        Google Gemini APIを使用して、本のページをデザインできます。
        テキスト内容を入力し、背景色を選択して、AIが美しいイラストを生成します。
        複数のページを作成して、本全体をデザインすることも可能です。
      </p>
      
      <BookPageDesigner />
      
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>このツールはGoogle Gemini APIを使用しています。</p>
        <p>生成された画像はAIによって作成されたものであり、実際の本や著作物とは関係ありません。</p>
      </div>
    </div>
  );
} 