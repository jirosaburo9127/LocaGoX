import type { HomeViewModel, Store } from "@/lib/domain";

function toCatalogSegment(value: string) {
  return value.trim().toLowerCase().replaceAll(/\s+/g, "-");
}

// 10 images rotate: /stores/store-1.jpg ~ store-10.jpg
function storeImage(index: number) {
  return `/stores/store-${(index % 10) + 1}.jpg`;
}

const mockStores: Store[] = [
  // ===== 恵比寿 (5店舗) =====
  {
    id: "mock-hitotoki-no-shizuku", slug: "hitotoki-no-shizuku", name: "ひとときのしずく", area: "恵比寿", category: "ヘッドスパ",
    walkMinutes: 3, waitMinutes: 10, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["完全個室", "眼精疲労ケア", "睡眠改善"],
    heroCopy: "眠りに導くドライヘッドスパ専門店。恵比寿駅すぐの癒し空間。",
    faq: ["施術中に寝てしまっても大丈夫ですか？→はい、9割のお客様が眠られます。", "着替えは必要ですか？→お着替え不要、そのまま施術できます。", "男性も利用できますか？→はい、男女問わずご利用いただけます。"],
    menuHighlights: ["60分 至福のヘッドスパ ¥7,700", "90分 プレミアムコース ¥11,000", "40分 クイックリフレッシュ ¥5,500"],
    relatedStoreSlugs: ["head-stellar", "myu-ebisu"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-head-stellar", slug: "head-stellar", name: "Head Stellar", area: "恵比寿", category: "ヘッドスパ",
    walkMinutes: 2, waitMinutes: 5, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["駅近2分", "お一人様専用", "9割寝落ち"],
    heroCopy: "JR恵比寿駅徒歩2分。完全個室のドライヘッドスパ専門店。",
    faq: ["完全予約制ですか？→はい、完全予約制です。", "当日空き枠はありますか？→LINEで当日空き確認が可能です。", "所要時間はどれくらいですか？→コースにより40〜80分です。"],
    menuHighlights: ["60分 スタンダードコース ¥7,150", "80分 プレミアムコース ¥9,900", "40分 ショートコース ¥4,950"],
    relatedStoreSlugs: ["hitotoki-no-shizuku", "onkatsu-salon-on"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-onkatsu-salon-on", slug: "onkatsu-salon-on", name: "温活サロン ON", area: "恵比寿", category: "リラクゼーション",
    walkMinutes: 4, waitMinutes: 20, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["温活", "植物療法", "リピート率99%"],
    heroCopy: "日本初の総合温活サロン。14年以上の経験が導く癒しの時間。",
    faq: ["冷え性にも効果がありますか？→はい、冷え性改善に多くの実績があります。", "施術後にドリンクはありますか？→ハーブティーをご用意しています。", "芸能人も通っていますか？→多くの著名人にご愛顧いただいています。"],
    menuHighlights: ["90分 温活フルコース ¥16,500", "60分 ハーブ蒸し＋ヘッドスパ ¥11,000", "45分 温活ライトコース ¥7,700"],
    relatedStoreSlugs: ["tujuhl-ebisu", "js-medical-ebisu"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-tujuhl-ebisu", slug: "tujuhl-ebisu", name: "Tujuhl 恵比寿", area: "恵比寿", category: "リラクゼーション",
    walkMinutes: 3, waitMinutes: 10, lastOrderAt: "21:30", isOpen: true,
    benefitTags: ["バリ式", "クリームバス", "西口徒歩3分"],
    heroCopy: "恵比寿西口徒歩3分。バリ式クリームバスが人気のサロン。",
    faq: ["クリームバスとは何ですか？→バリ伝統のヘッドトリートメントです。", "ペアでの施術は可能ですか？→はい、ペアルームをご用意しています。", "オイルを使いますか？→はい、着替えをご用意しています。"],
    menuHighlights: ["60分 バリ式クリームバス ¥8,800", "90分 全身アロマトリートメント ¥13,200", "40分 フットケア ¥5,500"],
    relatedStoreSlugs: ["onkatsu-salon-on", "js-medical-ebisu"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-js-medical-ebisu", slug: "js-medical-ebisu", name: "J'sメディカル整体院 恵比寿・代官山院", area: "恵比寿", category: "整体",
    walkMinutes: 7, waitMinutes: 10, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["全額返金保証", "骨盤矯正", "オーダーメイド"],
    heroCopy: "全額返金保証付き。オーダーメイドの骨盤矯正整体。",
    faq: ["返金保証の条件は？→初回施術で効果を感じられなかった場合に適用されます。", "産後の骨盤矯正もできますか？→はい、産後ケアの実績が多数あります。", "初回の所要時間は？→初回はカウンセリング込みで約60分です。"],
    menuHighlights: ["60分 骨盤矯正コース ¥6,600", "40分 肩こり集中ケア ¥4,400", "80分 全身調整コース ¥8,800"],
    relatedStoreSlugs: ["head-stellar", "karadafactory-shibuya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },

  // ===== 中目黒 (5店舗) =====
  {
    id: "mock-hogushi-nakameguro", slug: "hogushi-nakameguro", name: "ほぐしの達人 中目黒店", area: "中目黒", category: "マッサージ",
    walkMinutes: 2, waitMinutes: 0, lastOrderAt: "23:00", isOpen: true,
    benefitTags: ["駅近2分", "23時まで営業", "2,480円〜"],
    heroCopy: "中目黒駅徒歩2分。遅い時間でも安心の本格もみほぐし。",
    faq: ["予約なしでも大丈夫ですか？→空いていれば飛び込みOKです。", "クレジットカードは使えますか？→はい、各種カード利用可能です。", "個室はありますか？→カーテンで仕切られた半個室です。"],
    menuHighlights: ["40分 全身もみほぐし ¥2,480", "60分 しっかりコース ¥3,680", "20分 ポイントケア ¥1,480"],
    relatedStoreSlugs: ["cerisier7", "kisai-nakameguro"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-cerisier7", slug: "cerisier7", name: "CERISIER7", area: "中目黒", category: "美容室",
    walkMinutes: 5, waitMinutes: 0, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["ヘッドスパ併設", "完全個室スパ", "マンツーマン"],
    heroCopy: "専属スパニストが施術するヘッドスパ併設の美容室。",
    faq: ["ヘッドスパだけの利用も可能ですか？→はい、スパのみのご予約も承ります。", "カットの所要時間は？→カットのみで約60分です。", "駐車場はありますか？→近隣コインパーキングをご利用ください。"],
    menuHighlights: ["カット ¥7,700", "カラー+カット ¥14,300", "ヘッドスパ60分 ¥8,800"],
    relatedStoreSlugs: ["kisai-nakameguro", "naturaglam-nakameguro"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常10分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kisai-nakameguro", slug: "kisai-nakameguro", name: "kisai 中目黒", area: "中目黒", category: "美容室",
    walkMinutes: 2, waitMinutes: 0, lastOrderAt: "19:30", isOpen: true,
    benefitTags: ["目黒川沿い", "有名建築家設計", "カラー◎"],
    heroCopy: "目黒川沿いの有名建築家が手がけた空間で美しくなる。",
    faq: ["指名料はかかりますか？→スタイリストにより異なります。", "髪質改善はできますか？→酸熱トリートメントをご用意しています。", "営業時間は？→10:00〜19:30（最終受付）です。"],
    menuHighlights: ["カット ¥6,600", "カラー+カット ¥13,200", "髪質改善TR ¥16,500"],
    relatedStoreSlugs: ["cerisier7", "naturaglam-nakameguro"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常10分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-naturaglam-nakameguro", slug: "naturaglam-nakameguro", name: "NATURAglam 中目黒スタジオ", area: "中目黒", category: "ヨガスタジオ",
    walkMinutes: 1, waitMinutes: 0, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["月4回4,800円", "駅徒歩1分", "少人数制"],
    heroCopy: "中目黒駅徒歩1分。月4,800円から始められるヨガスタジオ。",
    faq: ["体験レッスンはありますか？→初回体験1,000円で受講できます。", "初心者でも大丈夫ですか？→初心者向けクラスを多数ご用意しています。", "マットは必要ですか？→無料でレンタルできます。"],
    menuHighlights: ["60分 ベーシックヨガ", "75分 リラックスヨガ", "60分 朝ヨガクラス"],
    relatedStoreSlugs: ["katagiri-nakameguro", "lava-shibuya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-katagiri-nakameguro", slug: "katagiri-nakameguro", name: "かたぎり塾 中目黒店", area: "中目黒", category: "パーソナルジム",
    walkMinutes: 3, waitMinutes: 0, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["理学療法士監修", "月4回30,800円", "白基調の空間"],
    heroCopy: "理学療法士が監修。科学的根拠に基づくパーソナルトレーニング。",
    faq: ["食事指導はありますか？→LINEでの食事アドバイスが含まれます。", "運動未経験でも大丈夫？→はい、初心者の方が多く通われています。", "体験はできますか？→無料カウンセリング+体験トレーニングあり。"],
    menuHighlights: ["60分 パーソナルTR", "月4回コース ¥30,800", "月8回コース ¥55,000"],
    relatedStoreSlugs: ["naturaglam-nakameguro", "beyond-shibuya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },

  // ===== 代官山 (5店舗) =====
  {
    id: "mock-milagro-daikanyama", slug: "milagro-daikanyama", name: "Milagro", area: "代官山", category: "ネイルサロン",
    walkMinutes: 2, waitMinutes: 0, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["美大出身ネイリスト", "フィルイン", "完全個室"],
    heroCopy: "美大出身ネイリストが手がける完全個室の隠れ家サロン。",
    faq: ["フィルインとは何ですか？→爪を傷めずにジェルを付け替える技法です。", "デザインの持ち込みは可能ですか？→はい、画像をお持ちください。", "所要時間はどれくらい？→デザインにより90〜150分です。"],
    menuHighlights: ["ワンカラー ¥6,600", "アート込み定額 ¥8,800", "フットネイル ¥7,700"],
    relatedStoreSlugs: ["roovely-daikanyama", "tricca-daikanyama"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-roovely-daikanyama", slug: "roovely-daikanyama", name: "Nail salon Roovely 代官山店", area: "代官山", category: "ネイルサロン",
    walkMinutes: 4, waitMinutes: 0, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["パラジェル認定", "初回オフ無料", "定額コース"],
    heroCopy: "パラジェル認定サロン。爪に優しいネイルを提供。",
    faq: ["パラジェルは持ちが良いですか？→通常のジェルと同等以上の持続性です。", "初回のオフ代はかかりますか？→初回はオフ無料です。", "キッズスペースはありますか？→申し訳ございませんがありません。"],
    menuHighlights: ["定額シンプル ¥5,500", "定額アート ¥7,700", "ハンド+フット ¥11,000"],
    relatedStoreSlugs: ["milagro-daikanyama", "daikanyama-acupuncture"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-daikanyama-acupuncture", slug: "daikanyama-acupuncture", name: "代官山鍼灸マッサージ院", area: "代官山", category: "鍼灸",
    walkMinutes: 5, waitMinutes: 10, lastOrderAt: "19:30", isOpen: true,
    benefitTags: ["美容鍼", "オイルマッサージ", "女性人気"],
    heroCopy: "美容鍼とオイルマッサージが女性に人気の鍼灸院。",
    faq: ["美容鍼は痛いですか？→髪の毛ほどの細い鍼を使用するため、ほぼ痛みはありません。", "メイクしたまま受けられますか？→はい、メイクの上から施術可能です。", "鍼灸は保険適用ですか？→自費診療となります。"],
    menuHighlights: ["60分 美容鍼コース ¥8,800", "40分 鍼灸ケア ¥5,500", "90分 美容鍼+全身 ¥13,200"],
    relatedStoreSlugs: ["roovely-daikanyama", "tricca-daikanyama"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-tricca-daikanyama", slug: "tricca-daikanyama", name: "tricca 代官山本店", area: "代官山", category: "美容室",
    walkMinutes: 3, waitMinutes: 0, lastOrderAt: "19:30", isOpen: true,
    benefitTags: ["本店", "カット技術◎", "大人世代"],
    heroCopy: "代官山に本店を構える実力派ヘアサロン。",
    faq: ["指名料はかかりますか？→スタイリストにより550〜1,100円です。", "ヘッドスパはありますか？→はい、カットと併用で割引あり。", "駐車場は？→近隣コインパーキングをご案内しています。"],
    menuHighlights: ["カット ¥7,700", "カラー+カット ¥15,400", "ヘッドスパ ¥5,500"],
    relatedStoreSlugs: ["daikanyama-acupuncture", "playground-daikanyama"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常10分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-playground-daikanyama", slug: "playground-daikanyama", name: "PLAYGROUND 代官山", area: "代官山", category: "パーソナルジム",
    walkMinutes: 3, waitMinutes: 0, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["完全個室", "食事指導", "手ぶらOK"],
    heroCopy: "手ぶらで通える完全個室のパーソナルジム。",
    faq: ["ウェアのレンタルはありますか？→ウェア・シューズ・タオルすべて無料です。", "シャワーはありますか？→はい、シャワー完備です。", "体験はありますか？→無料カウンセリング+体験あり。"],
    menuHighlights: ["50分 パーソナルTR", "月4回コース ¥35,200", "月8回コース ¥61,600"],
    relatedStoreSlugs: ["tricca-daikanyama", "beyond-shibuya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },

  // ===== 渋谷 (5店舗) =====
  {
    id: "mock-goku-shibuya", slug: "goku-shibuya", name: "悟空のきもち 渋谷店", area: "渋谷", category: "ヘッドスパ",
    walkMinutes: 5, waitMinutes: 30, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["予約3ヶ月待ち", "絶頂睡眠", "メディア話題"],
    heroCopy: "予約殺到の「絶頂睡眠」ドライヘッドスパ専門店。",
    faq: ["予約はどうすれば？→キャンセル待ちをLINEで受付しています。", "施術時間はどれくらい？→約60分です。", "男性も利用できますか？→はい、男女問わずご利用いただけます。"],
    menuHighlights: ["60分 絶頂睡眠コース ¥7,480", "80分 プレミアム絶頂睡眠 ¥10,780"],
    relatedStoreSlugs: ["hitotoki-no-shizuku", "reraku-shibuya"], reliabilityState: "caution", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常15分以内", badgeLabel: "確認しながら案内中"
  },
  {
    id: "mock-reraku-shibuya", slug: "reraku-shibuya", name: "Re.Ra.Ku 渋谷店", area: "渋谷", category: "リラクゼーション",
    walkMinutes: 3, waitMinutes: 5, lastOrderAt: "21:30", isOpen: true,
    benefitTags: ["駅近3分", "当日OK", "肩甲骨ストレッチ"],
    heroCopy: "肩甲骨ストレッチで人気のリラクゼーションサロン。",
    faq: ["予約なしでも大丈夫？→当日飛び込みもOKです。", "着替えは必要？→着替え不要です。", "メニューのおすすめは？→肩甲骨ストレッチ+ボディケアが人気です。"],
    menuHighlights: ["40分 ボディケア ¥4,070", "60分 肩甲骨ストレッチ+ケア ¥6,600", "30分 フットケア ¥3,300"],
    relatedStoreSlugs: ["goku-shibuya", "karadafactory-shibuya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-karadafactory-shibuya", slug: "karadafactory-shibuya", name: "カラダファクトリー 渋谷店", area: "渋谷", category: "整体",
    walkMinutes: 3, waitMinutes: 10, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["A.P.バランス整体", "330店舗展開", "当日予約OK"],
    heroCopy: "独自のA.P.バランス整体で根本改善。全国330店舗以上の実績。",
    faq: ["初回の所要時間は？→検査+施術で約80分です。", "当日予約はできますか？→はい、LINEからも予約可能です。", "回数券はありますか？→お得な回数券をご用意しています。"],
    menuHighlights: ["60分 A.P.バランス整体 ¥6,580", "40分 部分ケア ¥4,180", "80分 全身調整 ¥8,580"],
    relatedStoreSlugs: ["reraku-shibuya", "beyond-shibuya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-beyond-shibuya", slug: "beyond-shibuya", name: "BEYOND 渋谷店", area: "渋谷", category: "パーソナルジム",
    walkMinutes: 5, waitMinutes: 0, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["入会金無料", "コンテスト実績No.1", "22時まで"],
    heroCopy: "コンテスト優勝者在籍。入会金無料のパーソナルジム。",
    faq: ["入会金はいくらですか？→入会金は無料です。", "体験トレーニングはできますか？→初回体験5,500円で受けられます。", "食事指導はありますか？→プランにより食事指導が含まれます。"],
    menuHighlights: ["50分 パーソナルTR", "10回チケット ¥96,800", "短期集中16回 ¥281,600"],
    relatedStoreSlugs: ["karadafactory-shibuya", "lava-shibuya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-lava-shibuya", slug: "lava-shibuya", name: "LAVA 渋谷店", area: "渋谷", category: "ヨガスタジオ",
    walkMinutes: 3, waitMinutes: 0, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["ホットヨガ", "体験0円", "女性専用"],
    heroCopy: "体験レッスン0円。日本最大級のホットヨガスタジオ。",
    faq: ["体験当日に入会するとお得ですか？→入会金・登録金が無料になります。", "シャワーはありますか？→シャワー・アメニティ完備です。", "男性は利用できますか？→渋谷店は女性専用です。"],
    menuHighlights: ["60分 ベーシックホットヨガ", "60分 リンパリフレッシュヨガ", "60分 パワーヨガ"],
    relatedStoreSlugs: ["beyond-shibuya", "naturaglam-nakameguro"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },

  // ===== 広尾 (5店舗) =====
  {
    id: "mock-hiroo-kokoro", slug: "hiroo-kokoro", name: "広尾こころ鍼灸整骨院", area: "広尾", category: "鍼灸",
    walkMinutes: 4, waitMinutes: 10, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["鍼灸+矯正", "夜20時まで", "根本改善"],
    heroCopy: "手技・鍼灸・矯正を組み合わせて根本改善に導く鍼灸整骨院。",
    faq: ["保険は使えますか？→症状により保険適用可能です。ご相談ください。", "仕事帰りに通えますか？→平日20時まで受付しています。", "広尾駅から近いですか？→広尾駅から徒歩4分です。"],
    menuHighlights: ["鍼灸施術 ¥5,500", "骨盤矯正 ¥4,400", "全身調整+鍼灸 ¥8,800"],
    relatedStoreSlugs: ["ishii-hiroo", "bioplus-hiroo"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-ishii-hiroo", slug: "ishii-hiroo", name: "石井治療院 広尾サロン", area: "広尾", category: "鍼灸",
    walkMinutes: 1, waitMinutes: 15, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["駅出口すぐ", "小顔美容鍼", "気功"],
    heroCopy: "広尾駅3番出口すぐ。鍼灸・整体・気功の複合治療院。",
    faq: ["小顔の効果はどれくらい持ちますか？→施術直後から実感でき、回数を重ねると持続性が上がります。", "気功とは何ですか？→体のエネルギーバランスを整える東洋の伝統療法です。", "予約は必要ですか？→完全予約制です。"],
    menuHighlights: ["60分 美容鍼+小顔 ¥11,000", "50分 鍼灸+整体 ¥8,800", "40分 気功ヒーリング ¥6,600"],
    relatedStoreSlugs: ["hiroo-kokoro", "bioplus-hiroo"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常10分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-bioplus-hiroo", slug: "bioplus-hiroo", name: "距骨サロン bioplus 広尾本店", area: "広尾", category: "整体",
    walkMinutes: 3, waitMinutes: 5, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["距骨調整", "1回で実感", "本店"],
    heroCopy: "足元から整える距骨調整の本店サロン。1回で効果を実感。",
    faq: ["距骨調整とは？→足首の骨（距骨）を調整し全身のバランスを整える施術です。", "1回で効果はありますか？→多くの方が初回で変化を実感されています。", "痛みはありますか？→ソフトな施術で痛みはほとんどありません。"],
    menuHighlights: ["60分 距骨調整コース ¥8,800", "40分 フットケア ¥5,500", "80分 全身+距骨 ¥12,100"],
    relatedStoreSlugs: ["ishii-hiroo", "zen-place-hiroo"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-zen-place-hiroo", slug: "zen-place-hiroo", name: "zen place pilates 広尾", area: "広尾", category: "ヨガスタジオ",
    walkMinutes: 2, waitMinutes: 0, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["マシンピラティス", "少人数制", "姿勢改善"],
    heroCopy: "最新リフォーマー完備。少人数制のマシンピラティス。",
    faq: ["体験レッスンの料金は？→3,300円で体験できます。", "運動経験がなくても大丈夫？→はい、初心者クラスからスタートできます。", "マットは必要ですか？→マシンレッスンはマット不要です。"],
    menuHighlights: ["55分 グループマシンピラティス", "55分 プライベートレッスン ¥9,900", "55分 マットピラティス"],
    relatedStoreSlugs: ["bioplus-hiroo", "minx-hiroo"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-minx-hiroo", slug: "minx-hiroo", name: "MINX 広尾店", area: "広尾", category: "美容室",
    walkMinutes: 3, waitMinutes: 0, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["受賞歴多数", "大人女性", "上質空間"],
    heroCopy: "受賞歴多数。大人女性のための上質ヘアサロン。",
    faq: ["指名料はいくらですか？→1,100円〜です。", "キッズスペースはありますか？→申し訳ございませんがありません。", "ヘッドスパはありますか？→はい、認定スパニストが施術します。"],
    menuHighlights: ["カット ¥8,250", "カラー+カット ¥17,600", "トリートメント ¥5,500"],
    relatedStoreSlugs: ["zen-place-hiroo", "hiroo-kokoro"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常10分以内", badgeLabel: "LINE相談しやすい掲載店"
  },

  // ===== 三軒茶屋 (5店舗) =====
  {
    id: "mock-advance-sangenjaya", slug: "advance-sangenjaya", name: "ADVANCE世田谷鍼灸整骨院", area: "三軒茶屋", category: "鍼灸",
    walkMinutes: 4, waitMinutes: 10, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["鍼灸+パーソナルTR", "美容鍼", "痛み改善"],
    heroCopy: "鍼灸とパーソナルトレーニングを同時に叶える整骨院。",
    faq: ["トレーニングと鍼灸を組み合わせられますか？→はい、お時間内で自由に組み合わせ可能です。", "美容鍼もできますか？→美容鍼コースをご用意しています。", "スポーツ障害にも対応？→アスリートのケア実績が多数あります。"],
    menuHighlights: ["60分 鍼灸+TR ¥8,800", "40分 美容鍼 ¥6,600", "80分 全身トータルケア ¥11,000"],
    relatedStoreSlugs: ["sancha-seikotsu", "force-sangenjaya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sancha-seikotsu", slug: "sancha-seikotsu", name: "三茶しゃれなあど整骨院・鍼灸院", area: "三軒茶屋", category: "整体",
    walkMinutes: 4, waitMinutes: 5, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["土日祝営業", "20時まで", "骨盤矯正"],
    heroCopy: "三軒茶屋駅徒歩4分。土日祝も20時まで診療。",
    faq: ["土日祝日も営業していますか？→はい、土・日・祝日も20時まで受付しています。", "保険は使えますか？→症状によりますのでご相談ください。", "予約は必要ですか？→予約優先制ですが、当日受付も可能です。"],
    menuHighlights: ["骨盤矯正 ¥4,400", "肩こり施術 ¥3,300", "全身調整 ¥6,600"],
    relatedStoreSlugs: ["advance-sangenjaya", "force-sangenjaya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-force-sangenjaya", slug: "force-sangenjaya", name: "パーソナルジム FORCE 三軒茶屋", area: "三軒茶屋", category: "パーソナルジム",
    walkMinutes: 3, waitMinutes: 0, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["整体+TR", "マッサージ師在籍", "心身両面"],
    heroCopy: "トレーニングとソフト整体のトータルサポート。",
    faq: ["整体も受けられますか？→マッサージ師によるソフト整体が含まれます。", "ダイエット目的でも通えますか？→ダイエット・ボディメイク専門プランあり。", "体験はありますか？→無料カウンセリング+体験あり。"],
    menuHighlights: ["60分 パーソナルTR+整体", "月4回コース ¥33,000", "月8回コース ¥59,400"],
    relatedStoreSlugs: ["sancha-seikotsu", "bodysh-sangenjaya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-bodysh-sangenjaya", slug: "bodysh-sangenjaya", name: "Bodysh 三軒茶屋店", area: "三軒茶屋", category: "リラクゼーション",
    walkMinutes: 5, waitMinutes: 10, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["全室個室", "女性スタッフ", "アロマ"],
    heroCopy: "全室完全個室。女性スタッフによるアロマリラクゼーション。",
    faq: ["女性専用ですか？→女性専用サロンです。", "アロマオイルの種類は？→施術前に数種類からお選びいただけます。", "着替えはありますか？→お着替えをご用意しています。"],
    menuHighlights: ["60分 アロマリンパ ¥5,480", "90分 全身ボディケア ¥7,980", "40分 ヘッドスパ ¥3,980"],
    relatedStoreSlugs: ["force-sangenjaya", "rilakuru-sangenjaya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-rilakuru-sangenjaya", slug: "rilakuru-sangenjaya", name: "りらくる 三軒茶屋店", area: "三軒茶屋", category: "マッサージ",
    walkMinutes: 3, waitMinutes: 5, lastOrderAt: "翌2:00", isOpen: true,
    benefitTags: ["深夜2時まで", "予約不要", "コスパ◎"],
    heroCopy: "深夜2時まで営業。予約なしでふらっと立ち寄れる。",
    faq: ["深夜料金はかかりますか？→深夜割増なしです。", "予約は必要ですか？→予約なしでもOKです。", "クレジットカードは使えますか？→はい、各種カード対応。"],
    menuHighlights: ["60分 もみほぐし ¥3,980", "40分 足つぼ ¥2,980", "30分 ヘッドケア ¥2,480"],
    relatedStoreSlugs: ["bodysh-sangenjaya", "hogushi-nakameguro"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },

  // ===== 自由が丘 (5店舗) =====
  {
    id: "mock-beyond-jiyugaoka", slug: "beyond-jiyugaoka", name: "BEYOND 自由が丘店", area: "自由が丘", category: "パーソナルジム",
    walkMinutes: 3, waitMinutes: 0, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["入会金無料", "体験無料", "広々空間"],
    heroCopy: "入会金・体験無料。広々とした空間で集中トレーニング。",
    faq: ["入会金は本当に無料ですか？→はい、入会金は一切かかりません。", "初心者でも大丈夫？→初心者の方にも丁寧に指導します。", "子連れでも通えますか？→お子様連れでも対応可能です。"],
    menuHighlights: ["50分 パーソナルTR", "10回チケット ¥96,800", "短期集中16回 ¥281,600"],
    relatedStoreSlugs: ["outline-jiyugaoka", "sweet-jiyugaoka"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-outline-jiyugaoka", slug: "outline-jiyugaoka", name: "OUTLINE 自由が丘店", area: "自由が丘", category: "パーソナルジム",
    walkMinutes: 4, waitMinutes: 0, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["女性専用", "子連れOK", "完全オーダーメイド"],
    heroCopy: "女性専用・子連れOK。完全オーダーメイドのパーソナルジム。",
    faq: ["女性専用ですか？→はい、女性専用のジムです。", "子供を連れていけますか？→お子様連れ大歓迎です。", "食事制限は厳しいですか？→無理のない食事指導を行います。"],
    menuHighlights: ["75分 パーソナルTR", "月8回コース ¥84,800", "2ヶ月16回 ¥184,800"],
    relatedStoreSlugs: ["beyond-jiyugaoka", "tbc-jiyugaoka"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-tbc-jiyugaoka", slug: "tbc-jiyugaoka", name: "エステティックTBC 自由が丘店", area: "自由が丘", category: "エステ",
    walkMinutes: 2, waitMinutes: 15, lastOrderAt: "19:30", isOpen: true,
    benefitTags: ["大手安心", "体験あり", "フェイシャル"],
    heroCopy: "40年以上の歴史を持つ大手エステサロン。まずは体験から。",
    faq: ["体験の料金は？→体験は5,000円です。", "勧誘はありますか？→強引な勧誘は一切しません。", "男性も利用できますか？→男性はメンズTBCをご利用ください。"],
    menuHighlights: ["フェイシャル体験 ¥5,000", "ボディシェイプ ¥12,100", "脱毛体験 ¥1,000"],
    relatedStoreSlugs: ["outline-jiyugaoka", "sweet-jiyugaoka"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常10分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sweet-jiyugaoka", slug: "sweet-jiyugaoka", name: "Sweet 自由が丘", area: "自由が丘", category: "美容室",
    walkMinutes: 3, waitMinutes: 0, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["髪質改善", "大人女性", "南口3分"],
    heroCopy: "大人女性の髪質改善に定評のあるヘアサロン。",
    faq: ["髪質改善トリートメントの所要時間は？→カット込みで約2時間です。", "白髪染めもできますか？→はい、白髪ぼかしカラーも人気です。", "駐車場はありますか？→近隣コインパーキングをご利用ください。"],
    menuHighlights: ["カット ¥6,600", "カラー+カット ¥13,200", "髪質改善TR ¥16,500"],
    relatedStoreSlugs: ["tbc-jiyugaoka", "luria-jiyugaoka"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常10分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-luria-jiyugaoka", slug: "luria-jiyugaoka", name: "Luria 自由が丘店", area: "自由が丘", category: "ネイルサロン",
    walkMinutes: 5, waitMinutes: 0, lastOrderAt: "19:30", isOpen: true,
    benefitTags: ["ネイル+まつげ同時", "キッズスペース", "防音"],
    heroCopy: "ネイルとまつげの同時施術OK。防音キッズスペース完備。",
    faq: ["ネイルとまつげを同時にできますか？→はい、同時施術で時短になります。", "子連れでも大丈夫ですか？→防音キッズスペースがあるので安心です。", "フットネイルもできますか？→はい、ハンドとフットの同時も可能です。"],
    menuHighlights: ["ワンカラー ¥5,500", "定額アート ¥7,700", "ネイル+まつげ同時 ¥12,100"],
    relatedStoreSlugs: ["sweet-jiyugaoka", "beyond-jiyugaoka"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },

  // ===== 学芸大学 (5店舗) =====
  {
    id: "mock-stars-gakudai", slug: "stars-gakudai", name: "スターズ鍼灸整骨院 学芸大学", area: "学芸大学", category: "鍼灸",
    walkMinutes: 3, waitMinutes: 10, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["国家資格保有", "プロアスリート対応", "筋膜リリース"],
    heroCopy: "全スタッフ国家資格保有。プロアスリートのケア実績を持つ鍼灸院。",
    faq: ["スタッフは資格を持っていますか？→全員が国家資格を保有しています。", "スポーツ後のケアもできますか？→はい、プロアスリートのケア経験があります。", "鍼が怖いのですが→髪の毛ほどの細い鍼を使うため、ほぼ痛みはありません。"],
    menuHighlights: ["60分 オーダーメイドメンテナンス ¥7,700", "40分 鍼灸マッサージ ¥5,500", "80分 全身+鍼灸 ¥9,900"],
    relatedStoreSlugs: ["trigger-gakudai", "karadafactory-gakudai"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-trigger-gakudai", slug: "trigger-gakudai", name: "TRIGGER鍼灸整体院 学芸大学駅前院", area: "学芸大学", category: "整体",
    walkMinutes: 3, waitMinutes: 5, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["トリガーポイント", "根本改善", "清潔な院内"],
    heroCopy: "トリガーポイントに直接アプローチ。不調を根本から改善。",
    faq: ["トリガーポイントとは？→痛みの原因となる筋肉の硬結部分のことです。", "何回で効果を感じますか？→個人差はありますが多くの方が3回目で実感されます。", "予約は必要ですか？→予約優先制です。LINEから予約できます。"],
    menuHighlights: ["60分 トリガーポイント整体 ¥6,600", "40分 部分ケア ¥4,400", "80分 全身+鍼灸 ¥9,900"],
    relatedStoreSlugs: ["stars-gakudai", "karadafactory-gakudai"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-karadafactory-gakudai", slug: "karadafactory-gakudai", name: "カラダファクトリー 学芸大学店", area: "学芸大学", category: "整体",
    walkMinutes: 2, waitMinutes: 5, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["駅近2分", "A.P.バランス", "1700万人実績"],
    heroCopy: "学芸大学駅徒歩2分。1,700万人以上の施術実績。",
    faq: ["初めてですが大丈夫ですか？→初回は丁寧なカウンセリングから始めます。", "回数券はありますか？→お得な回数券をご用意しています。", "クレジットカードは使えますか？→各種カード対応しています。"],
    menuHighlights: ["60分 A.P.バランス整体 ¥6,580", "40分 部分調整 ¥4,180", "80分 全身調整 ¥8,580"],
    relatedStoreSlugs: ["trigger-gakudai", "sunmoon-gakudai"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sunmoon-gakudai", slug: "sunmoon-gakudai", name: "Sun & Moon Yoga", area: "学芸大学", category: "ヨガスタジオ",
    walkMinutes: 5, waitMinutes: 0, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["英語OK", "国際色豊か", "アシュタンガ"],
    heroCopy: "英語クラスあり。国際色豊かな本格ヨガスタジオ。",
    faq: ["英語でレッスンを受けられますか？→はい、英語クラスを複数ご用意しています。", "初心者でも参加できますか？→ビギナークラスからスタートできます。", "ドロップインは可能ですか？→はい、1回3,500円で参加できます。"],
    menuHighlights: ["90分 アシュタンガヨガ", "60分 ハタヨガ", "75分 ヴィンヤサフロー"],
    relatedStoreSlugs: ["karadafactory-gakudai", "bump-gakudai"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-bump-gakudai", slug: "bump-gakudai", name: "BUMP 学芸大学", area: "学芸大学", category: "美容室",
    walkMinutes: 3, waitMinutes: 0, lastOrderAt: "19:30", isOpen: true,
    benefitTags: ["メンズ人気", "フェードカット", "バーバー風"],
    heroCopy: "メンズカットが得意。バーバー風のおしゃれヘアサロン。",
    faq: ["男性客が多いですか？→はい、お客様の7割が男性です。", "眉カットはできますか？→カットに含まれています。", "パーマもできますか？→はい、メンズパーマ対応しています。"],
    menuHighlights: ["カット ¥5,500", "カット+カラー ¥11,000", "パーマ ¥8,800"],
    relatedStoreSlugs: ["sunmoon-gakudai", "stars-gakudai"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },

  // ===== 祐天寺 (5店舗) =====
  {
    id: "mock-kenkodo-yutenji", slug: "kenkodo-yutenji", name: "健康堂整骨院 祐天寺院", area: "祐天寺", category: "整体",
    walkMinutes: 1, waitMinutes: 5, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["駅徒歩1分", "整体+鍼+カッピング", "幅広い施術"],
    heroCopy: "祐天寺駅徒歩1分。整体・鍼・カッピングなど幅広く対応。",
    faq: ["カッピングとは？→吸い玉で血流を改善する伝統的な療法です。", "保険は使えますか？→症状により保険適用可能です。", "予約は必要ですか？→予約優先制です。電話またはLINEで受付。"],
    menuHighlights: ["整体施術 ¥5,500", "鍼治療 ¥4,400", "カッピング ¥3,300"],
    relatedStoreSlugs: ["imc-yutenji", "katagiri-yutenji"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-imc-yutenji", slug: "imc-yutenji", name: "IMC TRAINING GYM 祐天寺", area: "祐天寺", category: "パーソナルジム",
    walkMinutes: 1, waitMinutes: 0, lastOrderAt: "21:30", isOpen: true,
    benefitTags: ["医療資格トレーナー", "鍼灸+TR", "駅徒歩1分"],
    heroCopy: "医療資格者によるトレーニングと鍼灸の複合ジム。",
    faq: ["トレーナーは医療資格を持っていますか？→はい、国家資格保有者が指導します。", "鍼灸も受けられますか？→トレーニングと鍼灸の組み合わせが可能です。", "体験はありますか？→初回体験を実施しています。"],
    menuHighlights: ["60分 パーソナルTR ¥8,800", "60分 TR+鍼灸 ¥11,000", "月4回コース ¥33,000"],
    relatedStoreSlugs: ["kenkodo-yutenji", "katagiri-yutenji"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-katagiri-yutenji", slug: "katagiri-yutenji", name: "かたぎり塾 祐天寺店", area: "祐天寺", category: "パーソナルジム",
    walkMinutes: 1, waitMinutes: 0, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["駅徒歩1分", "低価格", "プロ指導"],
    heroCopy: "祐天寺駅徒歩1分。プロの指導を低価格で受けられる。",
    faq: ["料金はいくらですか？→月4回コース30,800円からです。", "食事指導はありますか？→LINEでの食事アドバイスが含まれます。", "手ぶらで通えますか？→ウェアレンタルあり、シューズ持参をお願いしています。"],
    menuHighlights: ["60分 パーソナルTR", "月4回コース ¥30,800", "月8回コース ¥55,000"],
    relatedStoreSlugs: ["imc-yutenji", "fuchibe-yutenji"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-fuchibe-yutenji", slug: "fuchibe-yutenji", name: "ヘアコンシェルジュ Fuchibe", area: "祐天寺", category: "美容室",
    walkMinutes: 3, waitMinutes: 0, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["毛髪診断士", "完全個室", "頭浸浴"],
    heroCopy: "毛髪診断士がいる完全個室サロン。話題の頭浸浴を体験。",
    faq: ["頭浸浴とは？→お湯に頭を浸しながら行うリラクゼーションヘッドスパです。", "毛髪診断は無料ですか？→カット利用時は無料で診断します。", "個室は追加料金がかかりますか？→個室料金は込みです。"],
    menuHighlights: ["カット+クイックスパ+マッサージ ¥6,000", "頭浸浴 ¥5,500", "カラー+カット ¥12,100"],
    relatedStoreSlugs: ["katagiri-yutenji", "yutenji-massage"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常10分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-yutenji-massage", slug: "yutenji-massage", name: "ほぐし処 祐天寺", area: "祐天寺", category: "マッサージ",
    walkMinutes: 3, waitMinutes: 0, lastOrderAt: "23:00", isOpen: true,
    benefitTags: ["23時まで営業", "予約不要", "独自圧マッサージ"],
    heroCopy: "夜23時まで営業。独自の圧でコリにピンポイントアプローチ。",
    faq: ["予約は必要ですか？→予約なしで大丈夫です。", "ドライヘッドスパはありますか？→はい、メニューにございます。", "オイルトリートメントもできますか？→はい、オイルメニューもございます。"],
    menuHighlights: ["60分 全身もみほぐし ¥3,980", "40分 ドライヘッドスパ ¥2,980", "30分 フットケア ¥2,480"],
    relatedStoreSlugs: ["fuchibe-yutenji", "kenkodo-yutenji"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },

  // ===== 池尻大橋 (5店舗) =====
  {
    id: "mock-reraku-ikejiri", slug: "reraku-ikejiri", name: "Re.Ra.Ku 池尻大橋店", area: "池尻大橋", category: "リラクゼーション",
    walkMinutes: 3, waitMinutes: 5, lastOrderAt: "21:30", isOpen: true,
    benefitTags: ["肩甲骨ストレッチ", "WEB予約", "駅近3分"],
    heroCopy: "肩甲骨ストレッチが人気。池尻大橋駅徒歩3分。",
    faq: ["肩甲骨ストレッチとは？→肩甲骨周りの可動域を広げるオリジナルメソッドです。", "当日予約はできますか？→WEBから当日予約可能です。", "着替えは必要ですか？→着替え不要で施術できます。"],
    menuHighlights: ["40分 ボディケア ¥4,070", "60分 肩甲骨ストレッチ ¥6,600", "80分 全身+ストレッチ ¥8,800"],
    relatedStoreSlugs: ["fuwatto-ikejiri", "seitaiinbal-ikejiri"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-fuwatto-ikejiri", slug: "fuwatto-ikejiri", name: "ボディケア ふわっと 池尻大橋店", area: "池尻大橋", category: "マッサージ",
    walkMinutes: 2, waitMinutes: 0, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["女性も安心", "アロマ", "駅近2分"],
    heroCopy: "女性でも気軽に入れるアロマ&ボディケアサロン。",
    faq: ["女性一人でも入りやすいですか？→はい、女性のお客様が多いサロンです。", "オイルの種類は選べますか？→数種類からお選びいただけます。", "所要時間は？→コースにより40〜90分です。"],
    menuHighlights: ["60分 ボディケア ¥4,400", "40分 アロマリンパ ¥4,950", "90分 全身アロマ ¥7,700"],
    relatedStoreSlugs: ["reraku-ikejiri", "seitaiinbal-ikejiri"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-seitaiinbal-ikejiri", slug: "seitaiinbal-ikejiri", name: "セイタイイン バル", area: "池尻大橋", category: "整体",
    walkMinutes: 2, waitMinutes: 10, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["姿勢改善", "骨盤矯正", "隠れ家サロン"],
    heroCopy: "名医も絶賛の隠れ家整体サロン。姿勢改善・骨盤矯正専門。",
    faq: ["どんな施術ですか？→独自の手技で骨格と筋肉のバランスを整えます。", "何回通えば良いですか？→3〜5回で多くの方が効果を実感されます。", "予約は必要ですか？→完全予約制です。"],
    menuHighlights: ["60分 姿勢改善整体 ¥8,800", "40分 骨盤矯正 ¥6,600", "80分 全身調整 ¥11,000"],
    relatedStoreSlugs: ["fuwatto-ikejiri", "ichiki-ikejiri"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-ichiki-ikejiri", slug: "ichiki-ikejiri", name: "市來整骨院", area: "池尻大橋", category: "整体",
    walkMinutes: 1, waitMinutes: 5, lastOrderAt: "19:30", isOpen: true,
    benefitTags: ["駅徒歩1分", "口コミ高評価", "丁寧施術"],
    heroCopy: "池尻大橋駅徒歩1分。口コミで評判の整骨院。",
    faq: ["保険は使えますか？→急性の症状は保険適用可能です。", "初めてですが大丈夫？→初回は丁寧にカウンセリングします。", "駐車場はありますか？→近隣コインパーキングをご利用ください。"],
    menuHighlights: ["保険施術 ¥500〜", "60分 自費整体 ¥5,500", "40分 骨盤矯正 ¥4,400"],
    relatedStoreSlugs: ["seitaiinbal-ikejiri", "ikejiri-acupuncture"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-ikejiri-acupuncture", slug: "ikejiri-acupuncture", name: "はりきゅう処 池尻", area: "池尻大橋", category: "鍼灸",
    walkMinutes: 5, waitMinutes: 10, lastOrderAt: "19:30", isOpen: true,
    benefitTags: ["自律神経", "不眠改善", "お灸"],
    heroCopy: "自律神経を整える鍼灸とお灸の専門院。",
    faq: ["不眠にも効きますか？→はい、自律神経を整えることで睡眠の質が改善します。", "お灸は熱くないですか？→温かく感じる程度で心地よいです。", "初回の所要時間は？→カウンセリング込みで約90分です。"],
    menuHighlights: ["60分 鍼灸施術 ¥6,600", "40分 お灸コース ¥4,400", "80分 全身鍼灸 ¥8,800"],
    relatedStoreSlugs: ["ichiki-ikejiri", "reraku-ikejiri"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  }
];

// Assign image paths based on index
export function getStoreImage(index: number) {
  return storeImage(index);
}

export function getMockStores() {
  return mockStores;
}

export function getMockStoreBySlug(slug: string) {
  return mockStores.find((store) => store.slug === slug) ?? null;
}

export function getMockStoreById(id: string) {
  return mockStores.find((store) => store.id === id) ?? null;
}

export function getMockHomeView(): HomeViewModel {
  const openStores = mockStores.filter((s) => s.isOpen);
  const sorted = [...openStores].sort((a, b) => a.walkMinutes - b.walkMinutes);

  // Hero: nearest open store
  const heroStore = sorted[0];

  // Reservation shelf: next 6 nearest
  const reservationShelf = sorted.slice(1, 7);

  // Discovery shelf: mix of different areas/categories
  const seen = new Set([heroStore.id, ...reservationShelf.map((s) => s.id)]);
  const discovery = openStores.filter((s) => !seen.has(s.id)).slice(0, 8);

  return {
    locationLabel: "渋谷区恵比寿西 1-9 付近",
    heroStore,
    reservationShelf,
    discoveryShelf: discovery,
    qualitySegment: "green"
  };
}

export function getMockStoreSlugs() {
  return mockStores.map((store) => store.slug);
}

export function getMockRelatedStores(store: Store) {
  return mockStores.filter((candidate) => store.relatedStoreSlugs.includes(candidate.slug));
}

export function getMockAreaCategoryStaticParams() {
  const seen = new Set<string>();

  return mockStores
    .map((store) => ({
      area: toCatalogSegment(store.area),
      category: toCatalogSegment(store.category)
    }))
    .filter((entry) => {
      const key = `${entry.area}:${entry.category}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

export function getMockCategoryRows() {
  const categoryMap = new Map<string, Store[]>();
  for (const store of mockStores) {
    const list = categoryMap.get(store.category) ?? [];
    list.push(store);
    categoryMap.set(store.category, list);
  }
  return Array.from(categoryMap.entries())
    .filter(([, stores]) => stores.length >= 2)
    .slice(0, 5)
    .map(([category, stores]) => ({
      title: category,
      stores: stores.slice(0, 6)
    }));
}

export function getMockAreaRows() {
  const areaMap = new Map<string, Store[]>();
  for (const store of mockStores) {
    const list = areaMap.get(store.area) ?? [];
    list.push(store);
    areaMap.set(store.area, list);
  }
  return Array.from(areaMap.entries())
    .slice(0, 5)
    .map(([area, stores]) => ({
      title: area,
      stores: stores.slice(0, 5)
    }));
}

export function getMockAreaCategoryView(areaSegment: string, categorySegment: string) {
  const stores = mockStores.filter(
    (store) => toCatalogSegment(store.area) === areaSegment && toCatalogSegment(store.category) === categorySegment
  );

  if (stores.length === 0) {
    return null;
  }

  return {
    area: stores[0].area,
    category: stores[0].category,
    stores
  };
}
