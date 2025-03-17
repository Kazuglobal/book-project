'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download, AlertCircle, MessageCircle, BookOpen, Send, X, HelpCircle } from 'lucide-react';

// 柏の葉の特徴的な場所や要素
const KASHIWA_FEATURES = [
  {
    title: '柏の葉キャンパス駅',
    content: '柏の葉キャンパス駅は、千葉県柏市にあるつくばエクスプレスの駅です。駅周辺には大学や研究施設、商業施設が集まり、未来型の街づくりが進められています。',
    promptHint: '駅の周りには近代的な建物や緑豊かな公園があります。',
    funFacts: [
      '柏の葉キャンパス駅は2005年に開業しました。',
      '駅周辺は「環境共生都市」をコンセプトに開発されています。',
      '駅前には大型商業施設「ららぽーと柏の葉」があります。'
    ]
  },
  {
    title: '柏の葉公園',
    content: '広大な敷地に芝生広場や日本庭園、野球場などがあり、四季折々の自然を楽しめる公園です。春には桜が美しく咲き誇ります。',
    promptHint: '広い芝生と季節の花々、遊具で遊ぶ子どもたちがいます。',
    funFacts: [
      '柏の葉公園は約45ヘクタールの広さがあります。',
      '園内には約170種類の樹木が植えられています。',
      '日本庭園「水戸徳川家庭園」は江戸時代の様式を今に伝えています。'
    ]
  },
  {
    title: '東京大学柏キャンパス',
    content: '先端科学技術研究が行われる東京大学のキャンパスです。広大な敷地に最先端の研究施設が点在しています。',
    promptHint: '近代的な研究施設と緑豊かな環境が調和しています。',
    funFacts: [
      '東京大学柏キャンパスは2000年に開設されました。',
      '宇宙、エネルギー、生命科学などの先端研究が行われています。',
      '一般公開イベント「柏キャンパス一般公開」が毎年開催されています。'
    ]
  },
  {
    title: '千葉大学環境健康フィールド科学センター',
    content: '環境と健康をテーマにした研究・教育施設です。広大な農場や園芸施設があり、自然と調和した研究が行われています。',
    promptHint: '様々な植物が育てられている温室や農場があります。',
    funFacts: [
      '環境健康フィールド科学センターでは有機農法による野菜づくりを研究しています。',
      '「柏の葉カレッジリンク・プログラム」という市民向け講座を開催しています。',
      '敷地内には薬草園があり、約400種類の薬用植物が栽培されています。'
    ]
  },
  {
    title: '柏の葉アクアテラス',
    content: '水と緑に囲まれた遊歩道で、都市と自然の調和を感じられる空間です。水辺でくつろぐ人々の姿が見られます。',
    promptHint: '水路に沿って木々が並び、ベンチでくつろぐ人々がいます。',
    funFacts: [
      'アクアテラスは雨水を再利用する環境に配慮した設計になっています。',
      '夏には水遊びができるスポットとして人気です。',
      '夜間はライトアップされ、幻想的な雰囲気を楽しめます。'
    ]
  }
];

// 質問と回答のサンプル
const SAMPLE_QA = {
  '柏の葉キャンパス駅': [
    { question: '柏の葉キャンパス駅はいつ開業しましたか？', answer: '柏の葉キャンパス駅は2005年に開業しました。' },
    { question: '駅の周辺にはどんな施設がありますか？', answer: '駅周辺には大学や研究施設、ららぽーと柏の葉などの商業施設があります。' }
  ],
  '柏の葉公園': [
    { question: '柏の葉公園の広さはどれくらいですか？', answer: '柏の葉公園は約45ヘクタールの広さがあります。' },
    { question: '公園内で見られる花や植物は何がありますか？', answer: '桜、つつじ、あじさいなど季節の花々や、約170種類の樹木が植えられています。' }
  ],
  '東京大学柏キャンパス': [
    { question: '東京大学柏キャンパスではどんな研究が行われていますか？', answer: '宇宙、エネルギー、生命科学などの先端研究が行われています。' },
    { question: '一般の人も見学できますか？', answer: '毎年「柏キャンパス一般公開」というイベントが開催され、一般の方も見学できます。' }
  ]
};

// クイズデータ
const QUIZZES = {
  '柏の葉キャンパス駅': [
    {
      question: '柏の葉キャンパス駅が開業した年は？',
      options: ['2000年', '2005年', '2010年', '2015年'],
      correctAnswer: 1,
      explanation: '柏の葉キャンパス駅は2005年8月24日に開業しました。つくばエクスプレスの開業と同時に営業を開始しています。'
    },
    {
      question: '柏の葉キャンパス駅前にある大型商業施設の名前は？',
      options: ['イオンモール柏の葉', 'ららぽーと柏の葉', 'アリオ柏', 'マルイ柏の葉'],
      correctAnswer: 1,
      explanation: '駅前には「ららぽーと柏の葉」という大型商業施設があります。ショッピングやグルメを楽しめる人気スポットです。'
    }
  ],
  '柏の葉公園': [
    {
      question: '柏の葉公園の広さは約何ヘクタール？',
      options: ['約15ヘクタール', '約25ヘクタール', '約35ヘクタール', '約45ヘクタール'],
      correctAnswer: 3,
      explanation: '柏の葉公園は約45ヘクタール（東京ドーム約10個分）の広さがあります。広大な敷地に様々な施設が点在しています。'
    },
    {
      question: '柏の葉公園内にある日本庭園の名前は？',
      options: ['水戸徳川家庭園', '柏の葉日本庭園', '千葉伝統庭園', '江戸風庭園'],
      correctAnswer: 0,
      explanation: '公園内には「水戸徳川家庭園」という江戸時代の様式を今に伝える日本庭園があります。'
    }
  ],
  '東京大学柏キャンパス': [
    {
      question: '東京大学柏キャンパスが開設された年は？',
      options: ['1990年', '2000年', '2005年', '2010年'],
      correctAnswer: 1,
      explanation: '東京大学柏キャンパスは2000年に開設された比較的新しいキャンパスです。'
    },
    {
      question: '東京大学柏キャンパスで行われている研究分野として正しくないものは？',
      options: ['宇宙科学', 'エネルギー科学', '生命科学', '古典文学'],
      correctAnswer: 3,
      explanation: '東京大学柏キャンパスでは、宇宙、エネルギー、生命科学、環境学、情報科学などの先端研究が行われていますが、古典文学の研究は主に本郷キャンパスで行われています。'
    }
  ]
};

export default function KashiwaBookPage() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  
  // インタラクティブ機能のための状態
  const [showChat, setShowChat] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);
  
  // クイズ機能のための状態
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // チャットを最下部にスクロール
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 初期ページの設定
  useEffect(() => {
    const initialPages = [
      {
        title: '柏の葉の不思議な一日',
        content: '千葉県柏市柏の葉には、たくさんの不思議と発見がつまっています。今日は、その素敵な場所を探検する特別な一日。さあ、一緒に柏の葉の魅力を探しに行きましょう！',
        imageUrl: '',
        background: '#e6f7ff',
        funFacts: [
          '柏の葉エリアは「環境・健康・創造・交流」をテーマにした街づくりが進められています。',
          '柏の葉は東京都心から約30kmの距離にあります。',
          'つくばエクスプレスで秋葉原から約30分でアクセスできます。'
        ]
      },
      ...KASHIWA_FEATURES.map(feature => ({
        title: feature.title,
        content: feature.content,
        promptHint: feature.promptHint,
        funFacts: feature.funFacts || [],
        imageUrl: '',
        background: '#ffffff'
      })),
      {
        title: '柏の葉での素敵な一日の終わり',
        content: '柏の葉での冒険はいかがでしたか？自然と科学と人々の暮らしが調和するこの街には、まだまだたくさんの発見があります。また一緒に探検しましょうね！',
        imageUrl: '',
        background: '#ffe6e6',
        funFacts: [
          '柏の葉エリアは今も発展を続けており、新しい施設や取り組みが増え続けています。',
          '柏の葉は「スマートシティ」のモデル地区として国内外から注目されています。',
          '地域コミュニティの活動も盛んで、様々なイベントが開催されています。'
        ]
      }
    ];
    
    setPages(initialPages);
  }, []);

  // ページを切り替え
  const changePage = (direction) => {
    let newPage = currentPage;
    if (direction === 'next' && currentPage < pages.length - 1) {
      newPage = currentPage + 1;
    } else if (direction === 'prev' && currentPage > 0) {
      newPage = currentPage - 1;
    }
    
    setCurrentPage(newPage);
    // ページ切り替え時にチャットをリセット
    setMessages([
      { 
        role: 'system', 
        content: `こんにちは！「${pages[newPage]?.title}」についてお話ししましょう。質問があればどうぞ！` 
      }
    ]);
    
    // クイズをリセット
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizCompleted(false);
    
    // モーダルを閉じる
    setShowChat(false);
    setShowReview(false);
    setShowQuiz(false);
  };

  // 画像を生成
  const generateImage = async (pageIndex) => {
    if (pages.length === 0 || !pages[pageIndex]) return;
    
    const page = pages[pageIndex];
    if (page.imageUrl) return; // 既に画像がある場合はスキップ
    
    setIsLoading(true);
    setError('');
    setApiStatus('loading');
    
    try {
      const prompt = `柏の葉の絵本のイラスト: ${page.title}. ${page.promptHint || page.content.substring(0, 100)}`;
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generatePageImage',
          prompt: prompt,
          pageStyle: 'children',
          pageContent: page.content.substring(0, 100)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setApiStatus('error');
        throw new Error(errorData.error || '画像生成中にエラーが発生しました');
      }
      
      const data = await response.json();
      
      if (!data.imageUrl) {
        setApiStatus('error');
        throw new Error('画像URLが返されませんでした');
      }
      
      // 生成された画像を保存
      const updatedPages = [...pages];
      updatedPages[pageIndex] = {
        ...updatedPages[pageIndex],
        imageUrl: data.imageUrl
      };
      setPages(updatedPages);
      setApiStatus('success');
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err.message || '画像生成中にエラーが発生しました');
      setApiStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // 全ページの画像を生成
  const generateAllImages = async () => {
    for (let i = 0; i < pages.length; i++) {
      if (!pages[i].imageUrl) {
        await generateImage(i);
      }
    }
  };

  // 本全体をPDFとしてエクスポート
  const exportToPDF = () => {
    // PDFエクスポート機能の実装（将来的な拡張）
    alert('PDF出力機能は近日公開予定です');
  };
  
  // チャットメッセージを送信
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // ユーザーメッセージを追加
    const updatedMessages = [...messages, { role: 'user', content: newMessage }];
    setMessages(updatedMessages);
    setNewMessage('');
    
    // 現在のページに関連する情報を取得
    const currentPageData = pages[currentPage];
    const pageTitle = currentPageData?.title || '';
    
    try {
      // APIを呼び出して応答を取得
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          pageTitle: pageTitle
        }),
      });
      
      if (!response.ok) {
        throw new Error('チャットAPIでエラーが発生しました');
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'system', content: data.response }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: 'すみません、応答の取得中にエラーが発生しました。もう一度お試しください。' 
      }]);
    }
  };
  
  // 復習モードを表示
  const toggleReviewMode = () => {
    setShowReview(!showReview);
    setShowChat(false);
    setShowQuiz(false);
  };
  
  // チャットモードを表示
  const toggleChatMode = () => {
    setShowChat(!showChat);
    setShowReview(false);
    setShowQuiz(false);
    
    // チャットを初期化
    if (!showChat && messages.length === 0) {
      const currentPageData = pages[currentPage];
      setMessages([
        { 
          role: 'system', 
          content: `こんにちは！「${currentPageData?.title}」についてお話ししましょう。質問があればどうぞ！` 
        }
      ]);
    }
  };
  
  // クイズモードを表示
  const toggleQuizMode = () => {
    setShowQuiz(!showQuiz);
    setShowChat(false);
    setShowReview(false);
    
    // クイズをリセット
    if (!showQuiz) {
      setCurrentQuiz(0);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
      setQuizCompleted(false);
      setQuizScore(0);
    }
  };
  
  // クイズの回答を選択
  const selectAnswer = (index) => {
    if (!quizSubmitted) {
      setSelectedAnswer(index);
    }
  };
  
  // クイズの回答を提出
  const submitQuizAnswer = () => {
    if (selectedAnswer === null) return;
    
    const pageTitle = pages[currentPage]?.title;
    const quizzes = QUIZZES[pageTitle] || [];
    
    if (quizzes.length === 0) return;
    
    setQuizSubmitted(true);
    
    // 正解の場合はスコアを加算
    if (selectedAnswer === quizzes[currentQuiz].correctAnswer) {
      setQuizScore(prevScore => prevScore + 1);
    }
  };
  
  // 次のクイズに進む
  const nextQuiz = () => {
    const pageTitle = pages[currentPage]?.title;
    const quizzes = QUIZZES[pageTitle] || [];
    
    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };
  
  // クイズをリスタート
  const restartQuiz = () => {
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizCompleted(false);
    setQuizScore(0);
  };

  if (pages.length === 0) {
    return <div className="text-center p-8">絵本を準備中...</div>;
  }

  const currentPageData = pages[currentPage];
  const pageTitle = currentPageData?.title || '';
  const quizzes = QUIZZES[pageTitle] || [];
  const hasQuizzes = quizzes.length > 0;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">柏の葉の不思議な一日</h2>
      <p className="text-center mb-8 text-gray-600">千葉県柏市柏の葉を舞台にした絵本</p>
      
      {apiStatus === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>APIエラーが発生しました。環境変数の設定を確認してください。</span>
        </div>
      )}
      
      <div className="flex flex-col items-center">
        {/* プレビュー */}
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden mb-8 relative">
          <div 
            className="relative w-full aspect-[4/3] flex items-center justify-center"
            style={{ backgroundColor: currentPageData.background || '#ffffff' }}
          >
            {currentPageData.imageUrl ? (
              <img 
                src={currentPageData.imageUrl} 
                alt={currentPageData.title} 
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => generateImage(currentPage)}
                  disabled={isLoading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? '生成中...' : 'イラストを生成'}
                </button>
              </div>
            )}
            
            <div className="relative z-10 p-8 max-h-full overflow-auto mt-auto bg-white bg-opacity-80 w-full">
              <h3 className="text-xl font-bold mb-2">{currentPageData.title}</h3>
              <div className="prose max-w-none">
                <p>{currentPageData.content}</p>
              </div>
            </div>
            
            {/* インタラクティブボタン */}
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={toggleChatMode}
                className={`p-2 rounded-full ${showChat ? 'bg-indigo-600 text-white' : 'bg-white'} shadow hover:bg-indigo-100 transition-colors`}
                aria-label="チャットモード"
                title="この場所について質問する"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <button
                onClick={toggleReviewMode}
                className={`p-2 rounded-full ${showReview ? 'bg-indigo-600 text-white' : 'bg-white'} shadow hover:bg-indigo-100 transition-colors`}
                aria-label="復習モード"
                title="豆知識を見る"
              >
                <BookOpen className="w-5 h-5" />
              </button>
              {hasQuizzes && (
                <button
                  onClick={toggleQuizMode}
                  className={`p-2 rounded-full ${showQuiz ? 'bg-indigo-600 text-white' : 'bg-white'} shadow hover:bg-indigo-100 transition-colors`}
                  aria-label="クイズモード"
                  title="クイズに挑戦する"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 flex justify-between items-center">
            <button
              onClick={() => changePage('prev')}
              disabled={currentPage === 0}
              className="p-2 rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-50"
              aria-label="前のページ"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <span className="font-medium">ページ {currentPage + 1}/{pages.length}</span>
            </div>
            
            <button
              onClick={() => changePage('next')}
              disabled={currentPage === pages.length - 1}
              className="p-2 rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-50"
              aria-label="次のページ"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* 復習モード */}
          {showReview && (
            <div className="absolute inset-0 bg-white bg-opacity-95 z-20 p-6 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{currentPageData.title}の豆知識</h3>
                <button 
                  onClick={() => setShowReview(false)}
                  className="p-1 rounded-full hover:bg-gray-200"
                  aria-label="閉じる"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <ul className="space-y-3">
                {currentPageData.funFacts && currentPageData.funFacts.map((fact, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* チャットモード */}
          {showChat && (
            <div className="absolute inset-0 bg-white bg-opacity-95 z-20 flex flex-col">
              <div className="flex justify-between items-center p-3 border-b">
                <h3 className="font-bold">{currentPageData.title}について質問する</h3>
                <button 
                  onClick={() => setShowChat(false)}
                  className="p-1 rounded-full hover:bg-gray-200"
                  aria-label="閉じる"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user' 
                          ? 'bg-indigo-100 text-indigo-900' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              
              <div className="p-3 border-t flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="質問を入力してください..."
                  className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          
          {/* クイズモード */}
          {showQuiz && hasQuizzes && (
            <div className="absolute inset-0 bg-white bg-opacity-95 z-20 p-6 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{currentPageData.title}のクイズ</h3>
                <button 
                  onClick={() => setShowQuiz(false)}
                  className="p-1 rounded-full hover:bg-gray-200"
                  aria-label="閉じる"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {quizCompleted ? (
                <div className="text-center py-8">
                  <h4 className="text-xl font-bold mb-4">クイズ完了！</h4>
                  <p className="text-lg mb-6">あなたのスコア: {quizScore}/{quizzes.length}</p>
                  
                  {quizScore === quizzes.length ? (
                    <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
                      <p className="font-bold">素晴らしい！</p>
                      <p>全問正解です！柏の葉についてよく知っていますね。</p>
                    </div>
                  ) : quizScore >= quizzes.length / 2 ? (
                    <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-6">
                      <p className="font-bold">よくできました！</p>
                      <p>柏の葉についての知識が身についています。</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6">
                      <p className="font-bold">もう少し！</p>
                      <p>もう一度チャレンジして、柏の葉についてもっと学びましょう。</p>
                    </div>
                  )}
                  
                  <button
                    onClick={restartQuiz}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    もう一度挑戦する
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-2 text-sm text-gray-500">
                    問題 {currentQuiz + 1}/{quizzes.length}
                  </div>
                  
                  <h4 className="text-lg font-medium mb-4">{quizzes[currentQuiz].question}</h4>
                  
                  <div className="space-y-3 mb-6">
                    {quizzes[currentQuiz].options.map((option, index) => (
                      <div 
                        key={index}
                        onClick={() => selectAnswer(index)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedAnswer === index 
                            ? quizSubmitted
                              ? index === quizzes[currentQuiz].correctAnswer
                                ? 'bg-green-100 border-green-500'
                                : 'bg-red-100 border-red-500'
                              : 'bg-indigo-100 border-indigo-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  
                  {quizSubmitted && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      selectedAnswer === quizzes[currentQuiz].correctAnswer
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <p className="font-bold mb-1">
                        {selectedAnswer === quizzes[currentQuiz].correctAnswer ? '正解！' : '不正解'}
                      </p>
                      <p>{quizzes[currentQuiz].explanation}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-center">
                    {!quizSubmitted ? (
                      <button
                        onClick={submitQuizAnswer}
                        disabled={selectedAnswer === null}
                        className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                          selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        回答する
                      </button>
                    ) : (
                      <button
                        onClick={nextQuiz}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        次へ
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* コントロール */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={generateAllImages}
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            全ページのイラストを生成
          </button>
          
          <button
            onClick={exportToPDF}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            PDFとしてエクスポート
          </button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md mb-8 w-full max-w-2xl">
            <p className="font-bold">エラーが発生しました:</p>
            <p>{error}</p>
          </div>
        )}
        
        {/* サムネイル一覧 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
          {pages.map((page, index) => (
            <div 
              key={index}
              className={`cursor-pointer rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                currentPage === index ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => setCurrentPage(index)}
              role="button"
              tabIndex={0}
              aria-label={`ページ ${index + 1}: ${page.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setCurrentPage(index);
                }
              }}
            >
              <div 
                className="aspect-[4/3] relative"
                style={{ backgroundColor: page.background || '#ffffff' }}
              >
                {page.imageUrl ? (
                  <img 
                    src={page.imageUrl} 
                    alt={page.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-xs text-gray-500">イラスト未生成</span>
                  </div>
                )}
                
                {/* クイズアイコンの表示 */}
                {QUIZZES[page.title] && QUIZZES[page.title].length > 0 && (
                  <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <HelpCircle className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="p-2 bg-white">
                <p className="text-xs font-medium truncate">{page.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 