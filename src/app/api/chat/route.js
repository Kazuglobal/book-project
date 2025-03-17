import { NextResponse } from 'next/server';

// 柏の葉に関する情報データベース
const KASHIWA_INFO = {
  '柏の葉キャンパス駅': {
    facts: [
      '柏の葉キャンパス駅は2005年に開業しました。',
      '駅周辺は「環境共生都市」をコンセプトに開発されています。',
      '駅前には大型商業施設「ららぽーと柏の葉」があります。',
      'つくばエクスプレスの駅で、秋葉原から約30分でアクセスできます。',
      '駅周辺には東京大学や千葉大学のキャンパスがあります。'
    ],
    qa: [
      { 
        question: ['いつ開業', '開業年', '開業した年'], 
        answer: '柏の葉キャンパス駅は2005年8月24日に開業しました。つくばエクスプレスの開業と同時に営業を開始しています。' 
      },
      { 
        question: ['周辺', '近く', '施設'], 
        answer: '駅周辺には東京大学柏キャンパス、千葉大学環境健康フィールド科学センター、ららぽーと柏の葉などの商業施設、柏の葉公園などがあります。' 
      },
      { 
        question: ['アクセス', '行き方', '行く方法'], 
        answer: '柏の葉キャンパス駅はつくばエクスプレスの駅で、秋葉原駅から約30分、北千住駅から約20分でアクセスできます。' 
      }
    ]
  },
  '柏の葉公園': {
    facts: [
      '柏の葉公園は約45ヘクタールの広さがあります。',
      '園内には約170種類の樹木が植えられています。',
      '日本庭園「水戸徳川家庭園」は江戸時代の様式を今に伝えています。',
      '春には約400本の桜が咲き誇り、花見スポットとして人気です。',
      '公園内には野球場やテニスコートなどのスポーツ施設も充実しています。'
    ],
    qa: [
      { 
        question: ['広さ', '面積', 'どれくらい'], 
        answer: '柏の葉公園は約45ヘクタール（東京ドーム約10個分）の広さがあります。広大な敷地に様々な施設が点在しています。' 
      },
      { 
        question: ['花', '植物', '樹木'], 
        answer: '公園内には約170種類の樹木が植えられており、桜、つつじ、あじさいなど季節の花々を楽しむことができます。特に春の桜は約400本あり、見事です。' 
      },
      { 
        question: ['施設', '何がある', 'できること'], 
        answer: '公園内には日本庭園、野球場、テニスコート、芝生広場、じゃぶじゃぶ池（夏季）、バーベキュー場（予約制）などがあります。四季を通じて様々な活動が楽しめます。' 
      }
    ]
  },
  '東京大学柏キャンパス': {
    facts: [
      '東京大学柏キャンパスは2000年に開設されました。',
      '宇宙、エネルギー、生命科学などの先端研究が行われています。',
      '一般公開イベント「柏キャンパス一般公開」が毎年開催されています。',
      '広大な敷地に最先端の研究施設が点在しています。',
      '国際的な研究拠点として多くの研究者が集まっています。'
    ],
    qa: [
      { 
        question: ['研究', '何をしている', '何をやっている'], 
        answer: '東京大学柏キャンパスでは、宇宙、エネルギー、生命科学、環境学、情報科学などの先端研究が行われています。特に学際的・国際的な研究プロジェクトが多く進められています。' 
      },
      { 
        question: ['見学', '訪問', '行ける'], 
        answer: '毎年「柏キャンパス一般公開」というイベントが開催され、一般の方も見学できます。また、カフェテリアは一般の方も利用可能です。ただし、研究施設への立ち入りは通常制限されています。' 
      },
      { 
        question: ['いつできた', '設立', '歴史'], 
        answer: '東京大学柏キャンパスは2000年に開設された比較的新しいキャンパスです。本郷キャンパス、駒場キャンパスに次ぐ「第3のキャンパス」として位置づけられています。' 
      }
    ]
  }
};

// 一般的な質問への回答
const GENERAL_QA = [
  {
    question: ['こんにちは', 'おはよう', 'こんばんは'],
    answer: 'こんにちは！柏の葉について何か知りたいことはありますか？'
  },
  {
    question: ['ありがとう', 'サンキュー', 'thanks'],
    answer: 'どういたしまして！他に知りたいことがあれば、お気軽に質問してくださいね。'
  },
  {
    question: ['柏の葉', '柏市', 'かしわ'],
    answer: '柏の葉は千葉県柏市にあるエリアで、つくばエクスプレス柏の葉キャンパス駅を中心に発展している地域です。大学や研究施設、公園、商業施設などが集まり、環境に配慮した未来型の街づくりが進められています。'
  }
];

export async function POST(request) {
  try {
    const { message, pageTitle } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'メッセージが必要です' },
        { status: 400 }
      );
    }
    
    // 応答を生成
    const response = generateResponse(message, pageTitle);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'リクエスト処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * メッセージに対する応答を生成する関数
 */
function generateResponse(message, pageTitle) {
  // メッセージを小文字に変換
  const lowerMessage = message.toLowerCase();
  
  // 特定のページに関する情報を取得
  const pageInfo = KASHIWA_INFO[pageTitle];
  
  // 豆知識のリクエストをチェック
  if (lowerMessage.includes('豆知識') || lowerMessage.includes('面白い') || lowerMessage.includes('事実')) {
    if (pageInfo && pageInfo.facts.length > 0) {
      const randomFact = pageInfo.facts[Math.floor(Math.random() * pageInfo.facts.length)];
      return `豆知識: ${randomFact}`;
    } else {
      return `「${pageTitle}」についての豆知識はまだ準備中です。`;
    }
  }
  
  // ページ固有のQ&Aをチェック
  if (pageInfo && pageInfo.qa) {
    for (const item of pageInfo.qa) {
      for (const keyword of item.question) {
        if (lowerMessage.includes(keyword)) {
          return item.answer;
        }
      }
    }
  }
  
  // 一般的なQ&Aをチェック
  for (const item of GENERAL_QA) {
    for (const keyword of item.question) {
      if (lowerMessage.includes(keyword)) {
        return item.answer;
      }
    }
  }
  
  // デフォルトの応答
  return `「${pageTitle}」について、もう少し具体的に質問してみてください。「豆知識を教えて」と言っていただければ、面白い情報をお伝えします！`;
} 