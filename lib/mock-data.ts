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
  },
  // ===== 飲食店（居酒屋・レストラン・カフェ） =====
  {
    id: "mock-ebisu-yokocho", slug: "ebisu-yokocho", name: "恵比寿横丁", area: "恵比寿", category: "居酒屋",
    walkMinutes: 2, waitMinutes: 15, lastOrderAt: "翌3:00", isOpen: true,
    benefitTags: ["はしご酒", "20店舗入居", "深夜営業"],
    heroCopy: "20店舗が集まるはしご酒の聖地。",
    faq: ["各店舗ごとに注文です。", "予約は各店舗に直接。"],
    menuHighlights: ["串焼き盛り合わせ", "刺身5点盛り", "もつ煮込み"],
    relatedStoreSlugs: ["ebisu-shichirin", "ebisu-robata"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-ebisu-shichirin", slug: "ebisu-shichirin", name: "七輪焼肉 安安 恵比寿店", area: "恵比寿", category: "焼肉",
    walkMinutes: 3, waitMinutes: 20, lastOrderAt: "翌4:00", isOpen: true,
    benefitTags: ["食べ放題", "深夜OK", "コスパ◎"],
    heroCopy: "食べ放題2,980円〜。深夜4時まで営業。",
    faq: ["食べ放題は90分制です。", "ドリンクは別注文です。"],
    menuHighlights: ["食べ放題 ¥2,980", "特選カルビ", "冷麺"],
    relatedStoreSlugs: ["ebisu-yokocho", "shibuya-yakiniku"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-ebisu-robata", slug: "ebisu-robata", name: "炉端焼 いろり 恵比寿", area: "恵比寿", category: "居酒屋",
    walkMinutes: 4, waitMinutes: 10, lastOrderAt: "23:00", isOpen: true,
    benefitTags: ["炉端焼き", "個室あり", "日本酒豊富"],
    heroCopy: "目の前で焼き上げる炉端焼きの名店。",
    faq: ["個室は4名〜要予約です。", "コース料理は前日まで。"],
    menuHighlights: ["炉端焼き盛り合わせ", "釜飯", "日本酒飲み比べ"],
    relatedStoreSlugs: ["ebisu-yokocho", "nakameguro-izakaya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-ebisu-italian", slug: "ebisu-italian", name: "トラットリア ダル・ビルバンテ", area: "恵比寿", category: "イタリアン",
    walkMinutes: 5, waitMinutes: 10, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["本格イタリアン", "ワイン充実", "デート向き"],
    heroCopy: "恵比寿の隠れ家イタリアン。手打ちパスタが自慢。",
    faq: ["コース料理は2名〜。", "アレルギー対応可能です。"],
    menuHighlights: ["手打ちパスタ ¥1,800", "窯焼きピザ ¥1,600", "ティラミス ¥800"],
    relatedStoreSlugs: ["daikanyama-french", "ebisu-robata"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常10分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-ebisu-cafe", slug: "ebisu-cafe", name: "猿田彦珈琲 恵比寿本店", area: "恵比寿", category: "カフェ",
    walkMinutes: 1, waitMinutes: 5, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["スペシャルティ珈琲", "駅近1分", "テイクアウト"],
    heroCopy: "恵比寿発のスペシャルティコーヒー専門店。",
    faq: ["豆の購入もできます。", "Wi-Fiあります。"],
    menuHighlights: ["猿田彦ブレンド ¥500", "カフェラテ ¥600", "プリン ¥450"],
    relatedStoreSlugs: ["nakameguro-cafe", "daikanyama-cafe"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-nakameguro-izakaya", slug: "nakameguro-izakaya", name: "中目黒 いぐち", area: "中目黒", category: "居酒屋",
    walkMinutes: 3, waitMinutes: 20, lastOrderAt: "23:30", isOpen: true,
    benefitTags: ["予約困難", "日本酒", "和食創作"],
    heroCopy: "予約が取れない人気の創作和食居酒屋。",
    faq: ["予約は1ヶ月前から。", "コースのみの営業日あり。"],
    menuHighlights: ["おまかせコース ¥6,600", "〆の土鍋ご飯", "季節の刺身"],
    relatedStoreSlugs: ["ebisu-robata", "nakameguro-ramen"], reliabilityState: "caution", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常15分以内", badgeLabel: "確認しながら案内中"
  },
  {
    id: "mock-nakameguro-cafe", slug: "nakameguro-cafe", name: "Onibus Coffee 中目黒", area: "中目黒", category: "カフェ",
    walkMinutes: 4, waitMinutes: 5, lastOrderAt: "18:00", isOpen: true,
    benefitTags: ["ロースタリー", "目黒川沿い", "テラス席"],
    heroCopy: "目黒川沿いのロースタリーカフェ。",
    faq: ["テラス席はペットOKです。", "豆の販売もあります。"],
    menuHighlights: ["ドリップコーヒー ¥450", "フラットホワイト ¥550", "マフィン ¥350"],
    relatedStoreSlugs: ["ebisu-cafe", "daikanyama-cafe"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-nakameguro-ramen", slug: "nakameguro-ramen", name: "AFURI 中目黒", area: "中目黒", category: "ラーメン",
    walkMinutes: 2, waitMinutes: 15, lastOrderAt: "翌1:00", isOpen: true,
    benefitTags: ["柚子塩ラーメン", "深夜OK", "行列人気"],
    heroCopy: "柚子塩ラーメンで全国に名を馳せる人気店。",
    faq: ["食券制です。", "つけ麺もあります。"],
    menuHighlights: ["柚子塩らーめん ¥1,080", "つけ麺 ¥1,180", "チャーシュー丼 ¥400"],
    relatedStoreSlugs: ["shibuya-ramen", "nakameguro-izakaya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-shibuya-yakiniku", slug: "shibuya-yakiniku", name: "焼肉トラジ 渋谷店", area: "渋谷", category: "焼肉",
    walkMinutes: 4, waitMinutes: 25, lastOrderAt: "23:00", isOpen: true,
    benefitTags: ["黒毛和牛", "個室あり", "接待向き"],
    heroCopy: "黒毛和牛にこだわる本格焼肉。",
    faq: ["個室は2名〜予約可能です。", "アレルギー対応あり。"],
    menuHighlights: ["特選和牛盛り ¥4,980", "トラジ御膳 ¥2,480", "冷麺 ¥1,280"],
    relatedStoreSlugs: ["ebisu-shichirin", "shibuya-sushi"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常10分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-shibuya-sushi", slug: "shibuya-sushi", name: "すし匠 渋谷店", area: "渋谷", category: "寿司",
    walkMinutes: 6, waitMinutes: 30, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["おまかせ", "カウンター", "ミシュラン"],
    heroCopy: "カウンターで味わう本格江戸前鮨。",
    faq: ["おまかせのみです。", "予約は電話のみ。"],
    menuHighlights: ["おまかせ ¥15,000", "追加握り 時価", "日本酒ペアリング ¥5,000"],
    relatedStoreSlugs: ["shibuya-yakiniku", "daikanyama-french"], reliabilityState: "caution", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常15分以内", badgeLabel: "確認しながら案内中"
  },
  {
    id: "mock-shibuya-ramen", slug: "shibuya-ramen", name: "中華そば 渋谷 三丁目", area: "渋谷", category: "ラーメン",
    walkMinutes: 3, waitMinutes: 20, lastOrderAt: "22:30", isOpen: true,
    benefitTags: ["煮干し系", "行列必至", "限定メニュー"],
    heroCopy: "濃厚煮干しスープが癖になる人気ラーメン店。",
    faq: ["食券制です。", "並びは店外でお願いします。"],
    menuHighlights: ["特濃煮干しそば ¥980", "つけそば ¥1,050", "和え玉 ¥200"],
    relatedStoreSlugs: ["nakameguro-ramen", "shibuya-yakiniku"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-daikanyama-french", slug: "daikanyama-french", name: "レストラン パッション", area: "代官山", category: "フレンチ",
    walkMinutes: 5, waitMinutes: 0, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["記念日", "コース料理", "ソムリエ常駐"],
    heroCopy: "記念日に最適な本格フレンチレストラン。",
    faq: ["ドレスコードはスマートカジュアル。", "サプライズ演出可能です。"],
    menuHighlights: ["ランチコース ¥3,800", "ディナーコース ¥8,800", "デザートコース ¥2,800"],
    relatedStoreSlugs: ["ebisu-italian", "shibuya-sushi"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常10分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-daikanyama-cafe", slug: "daikanyama-cafe", name: "IVY PLACE", area: "代官山", category: "カフェ",
    walkMinutes: 3, waitMinutes: 10, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["テラス席", "ブランチ", "おしゃれ空間"],
    heroCopy: "代官山T-SITE隣のおしゃれカフェダイニング。",
    faq: ["テラス席は予約不可です。", "ランチは11:30〜。"],
    menuHighlights: ["パンケーキ ¥1,400", "アボカドトースト ¥1,200", "グリルチキン ¥1,800"],
    relatedStoreSlugs: ["nakameguro-cafe", "ebisu-cafe"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-jiyugaoka-sweets", slug: "jiyugaoka-sweets", name: "モンサンクレール", area: "自由が丘", category: "スイーツ",
    walkMinutes: 3, waitMinutes: 15, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["パティシエ辻口", "手土産", "テイクアウト"],
    heroCopy: "辻口博啓シェフの人気パティスリー。",
    faq: ["イートインは4席のみです。", "予約不可、並び順です。"],
    menuHighlights: ["セ・ラ・ヴィ ¥680", "モンブラン ¥720", "焼菓子セット ¥1,800"],
    relatedStoreSlugs: ["daikanyama-cafe", "jiyugaoka-pasta"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-jiyugaoka-pasta", slug: "jiyugaoka-pasta", name: "La Bohème 自由が丘", area: "自由が丘", category: "イタリアン",
    walkMinutes: 4, waitMinutes: 10, lastOrderAt: "翌3:00", isOpen: true,
    benefitTags: ["深夜営業", "テラス", "パスタ充実"],
    heroCopy: "深夜3時まで営業のカジュアルイタリアン。",
    faq: ["テラス席はペットOK。", "一人でもカウンター利用可。"],
    menuHighlights: ["ペスカトーレ ¥1,480", "マルゲリータ ¥1,280", "ティラミス ¥680"],
    relatedStoreSlugs: ["ebisu-italian", "jiyugaoka-sweets"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sangen-izakaya", slug: "sangen-izakaya", name: "三軒茶屋 まるみ", area: "三軒茶屋", category: "居酒屋",
    walkMinutes: 2, waitMinutes: 10, lastOrderAt: "23:00", isOpen: true,
    benefitTags: ["昭和レトロ", "もつ焼き", "安い旨い"],
    heroCopy: "三茶の昭和レトロもつ焼き酒場。",
    faq: ["予約不可、並び順です。", "現金のみです。"],
    menuHighlights: ["もつ焼き5本 ¥500", "ホッピーセット ¥450", "煮込み ¥350"],
    relatedStoreSlugs: ["ebisu-yokocho", "sangen-curry"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sangen-curry", slug: "sangen-curry", name: "シバカリー ワラ", area: "三軒茶屋", category: "カレー",
    walkMinutes: 3, waitMinutes: 15, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["スパイスカレー", "SNSで話題", "間借り系"],
    heroCopy: "三茶で人気のスパイスカレー専門店。",
    faq: ["売り切れ次第終了です。", "テイクアウト可。"],
    menuHighlights: ["2種あいがけ ¥1,300", "3種あいがけ ¥1,500", "ラッシー ¥400"],
    relatedStoreSlugs: ["sangen-izakaya", "shibuya-ramen"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  // ── 大阪（梅田・心斎橋・難波・天王寺） ──
  {
    id: "mock-osaka-umeda-izakaya-tokkuri", slug: "osaka-umeda-izakaya-tokkuri", name: "酒処 とっくり 梅田本店", area: "梅田", category: "居酒屋",
    walkMinutes: 3, waitMinutes: 10, lastOrderAt: "23:00", isOpen: true,
    benefitTags: ["飲み放題あり", "個室完備", "梅田駅近"],
    heroCopy: "梅田の路地裏で見つける大人の隠れ家居酒屋。",
    faq: ["飲み放題は2時間制です。", "個室は要予約です。"],
    menuHighlights: ["おまかせ刺身盛り ¥1,480", "出汁巻き玉子 ¥680", "名物もつ煮込み ¥780"],
    relatedStoreSlugs: ["osaka-umeda-ramen-tengu", "osaka-umeda-yakiniku-ushiwaka"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-osaka-umeda-yakiniku-ushiwaka", slug: "osaka-umeda-yakiniku-ushiwaka", name: "焼肉 牛若丸 梅田店", area: "梅田", category: "焼肉",
    walkMinutes: 5, waitMinutes: 20, lastOrderAt: "22:30", isOpen: true,
    benefitTags: ["A5黒毛和牛", "食べ放題あり", "デート向き"],
    heroCopy: "A5ランク黒毛和牛を炭火で味わう贅沢焼肉。",
    faq: ["食べ放題コースは90分制です。", "アレルギー対応可能です。"],
    menuHighlights: ["特選カルビ ¥1,980", "厚切りタン塩 ¥1,580", "和牛ユッケ ¥1,280"],
    relatedStoreSlugs: ["osaka-umeda-izakaya-tokkuri", "osaka-umeda-ramen-tengu"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-osaka-umeda-ramen-tengu", slug: "osaka-umeda-ramen-tengu", name: "麺屋 天狗 梅田店", area: "梅田", category: "ラーメン",
    walkMinutes: 2, waitMinutes: 15, lastOrderAt: "21:30", isOpen: true,
    benefitTags: ["濃厚豚骨", "替え玉無料", "深夜営業"],
    heroCopy: "濃厚豚骨スープが自慢の行列ラーメン店。",
    faq: ["替え玉は1杯無料です。", "大盛り無料サービスあり。"],
    menuHighlights: ["濃厚豚骨ラーメン ¥890", "味玉チャーシュー麺 ¥1,100", "餃子セット ¥1,200"],
    relatedStoreSlugs: ["osaka-umeda-izakaya-tokkuri", "osaka-namba-takoyaki-hachibei"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-osaka-shinsaibashi-cafe-komorebi", slug: "osaka-shinsaibashi-cafe-komorebi", name: "Café こもれび", area: "心斎橋", category: "カフェ",
    walkMinutes: 4, waitMinutes: 5, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["Wi-Fi完備", "電源あり", "自家焙煎"],
    heroCopy: "心斎橋の喧騒を忘れるこだわり自家焙煎カフェ。",
    faq: ["Wi-Fiパスワードはレジでお伝えします。", "ペット同伴はテラス席のみ可能です。"],
    menuHighlights: ["スペシャルティラテ ¥580", "自家製チーズケーキ ¥620", "季節のフルーツパフェ ¥880"],
    relatedStoreSlugs: ["osaka-shinsaibashi-seitai-rakuraku", "osaka-shinsaibashi-esthe-hana"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-osaka-shinsaibashi-seitai-rakuraku", slug: "osaka-shinsaibashi-seitai-rakuraku", name: "整体院 らくらく 心斎橋", area: "心斎橋", category: "整体",
    walkMinutes: 6, waitMinutes: 0, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["初回割引", "肩こり専門", "当日予約OK"],
    heroCopy: "肩こり・腰痛に特化した心斎橋の実力派整体院。",
    faq: ["初回は60分のカウンセリング付きです。", "当日予約も空きがあれば可能です。"],
    menuHighlights: ["全身整体60分 ¥5,500", "肩こり集中コース ¥4,400", "骨盤矯正 ¥6,600"],
    relatedStoreSlugs: ["osaka-shinsaibashi-cafe-komorebi", "osaka-shinsaibashi-esthe-hana"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-osaka-shinsaibashi-esthe-hana", slug: "osaka-shinsaibashi-esthe-hana", name: "エステサロン 花 心斎橋店", area: "心斎橋", category: "エステ",
    walkMinutes: 7, waitMinutes: 0, lastOrderAt: "19:30", isOpen: true,
    benefitTags: ["完全個室", "初回体験半額", "フェイシャル"],
    heroCopy: "完全個室で至福のフェイシャルエステ体験を。",
    faq: ["初回体験は通常価格の50%OFFです。", "メイク直しスペースあり。"],
    menuHighlights: ["フェイシャル60分 ¥8,800", "小顔矯正コース ¥7,700", "毛穴ケア ¥6,600"],
    relatedStoreSlugs: ["osaka-shinsaibashi-seitai-rakuraku", "osaka-shinsaibashi-cafe-komorebi"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-osaka-namba-biyoushitsu-clef", slug: "osaka-namba-biyoushitsu-clef", name: "hair salon Clef 難波店", area: "難波", category: "美容室",
    walkMinutes: 3, waitMinutes: 5, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["カット+カラー割", "トリートメント無料", "キッズOK"],
    heroCopy: "難波駅すぐ、トレンドスタイルが得意なサロン。",
    faq: ["キッズカットも対応しています。", "当日予約はLINEが便利です。"],
    menuHighlights: ["カット ¥4,400", "カット+カラー ¥8,800", "髪質改善トリートメント ¥5,500"],
    relatedStoreSlugs: ["osaka-namba-okonomiyaki-chitose", "osaka-namba-takoyaki-hachibei"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-osaka-namba-okonomiyaki-chitose", slug: "osaka-namba-okonomiyaki-chitose", name: "お好み焼き 千歳 難波本店", area: "難波", category: "お好み焼き",
    walkMinutes: 4, waitMinutes: 25, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["名物ミックス焼", "ソース自家製", "テーブル鉄板"],
    heroCopy: "自家製ソースで食べる大阪の味、本場のお好み焼き。",
    faq: ["焼き方はスタッフにお任せもできます。", "テイクアウト対応しています。"],
    menuHighlights: ["ミックス焼き ¥1,100", "豚玉 ¥850", "モダン焼き ¥1,200"],
    relatedStoreSlugs: ["osaka-namba-biyoushitsu-clef", "osaka-namba-takoyaki-hachibei"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-osaka-tennoji-sushi-kizuna", slug: "osaka-tennoji-sushi-kizuna", name: "寿司処 絆 天王寺", area: "天王寺", category: "寿司",
    walkMinutes: 8, waitMinutes: 15, lastOrderAt: "21:30", isOpen: true,
    benefitTags: ["カウンター寿司", "おまかせコース", "旬のネタ"],
    heroCopy: "天王寺で旬のネタを握るカウンター寿司。",
    faq: ["おまかせコースは要予約です。", "お子様向けメニューもあります。"],
    menuHighlights: ["おまかせ握り10貫 ¥3,300", "特上ちらし ¥2,200", "炙りサーモン ¥380"],
    relatedStoreSlugs: ["osaka-namba-okonomiyaki-chitose", "osaka-namba-takoyaki-hachibei"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-osaka-namba-takoyaki-hachibei", slug: "osaka-namba-takoyaki-hachibei", name: "たこ焼き 八兵衛 難波店", area: "難波", category: "たこ焼き",
    walkMinutes: 1, waitMinutes: 10, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["外カリ中トロ", "食べ歩き", "ソース3種"],
    heroCopy: "外はカリッと中はトロトロ、難波名物たこ焼き。",
    faq: ["イートインスペースあります。", "ソースは3種類から選べます。"],
    menuHighlights: ["たこ焼き8個 ¥600", "ねぎマヨたこ焼き ¥700", "明太チーズたこ焼き ¥750"],
    relatedStoreSlugs: ["osaka-namba-okonomiyaki-chitose", "osaka-namba-biyoushitsu-clef"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  // ── 京都（四条・河原町・祇園） ──
  {
    id: "mock-kyoto-shijo-cafe-tsukikage", slug: "kyoto-shijo-cafe-tsukikage", name: "喫茶 月影", area: "四条", category: "カフェ",
    walkMinutes: 3, waitMinutes: 10, lastOrderAt: "18:30", isOpen: true,
    benefitTags: ["町家カフェ", "抹茶ラテ", "静かな空間"],
    heroCopy: "築100年の町家で味わう京都のコーヒータイム。",
    faq: ["店内は撮影可能です。", "抹茶スイーツが人気です。"],
    menuHighlights: ["抹茶ラテ ¥650", "わらび餅パフェ ¥880", "京ブレンド珈琲 ¥550"],
    relatedStoreSlugs: ["kyoto-shijo-washoku-ichimon", "kyoto-shijo-matcha-uji"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kyoto-shijo-washoku-ichimon", slug: "kyoto-shijo-washoku-ichimon", name: "京料理 一文 四条本店", area: "四条", category: "和食",
    walkMinutes: 5, waitMinutes: 15, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["京懐石", "個室あり", "旬の京野菜"],
    heroCopy: "旬の京野菜を使った本格京懐石を堪能。",
    faq: ["ランチ懐石もございます。", "個室は2名様から利用可能です。"],
    menuHighlights: ["ランチ懐石 ¥3,300", "京野菜の天ぷら盛り ¥1,800", "鯛のかぶら蒸し ¥2,200"],
    relatedStoreSlugs: ["kyoto-shijo-cafe-tsukikage", "kyoto-gion-izakaya-kamogawa"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kyoto-gion-izakaya-kamogawa", slug: "kyoto-gion-izakaya-kamogawa", name: "酒肴 鴨川 祇園店", area: "祇園", category: "居酒屋",
    walkMinutes: 7, waitMinutes: 10, lastOrderAt: "23:00", isOpen: true,
    benefitTags: ["京おばんざい", "地酒豊富", "祇園の隠れ家"],
    heroCopy: "祇園の路地裏で京おばんざいと地酒を楽しむ夜。",
    faq: ["おばんざいは日替わりです。", "カウンター席は予約不要です。"],
    menuHighlights: ["おばんざい5種盛り ¥1,280", "京都地酒飲み比べ ¥1,500", "鴨ロース ¥1,100"],
    relatedStoreSlugs: ["kyoto-shijo-washoku-ichimon", "kyoto-kawaramachi-ramen-kitashiro"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kyoto-kawaramachi-seitai-miyabi", slug: "kyoto-kawaramachi-seitai-miyabi", name: "整体 雅 河原町店", area: "河原町", category: "整体",
    walkMinutes: 4, waitMinutes: 0, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["初回半額", "骨盤矯正", "女性専用"],
    heroCopy: "河原町で女性に人気の骨盤矯正専門整体。",
    faq: ["女性専用サロンです。", "初回は半額でお試しいただけます。"],
    menuHighlights: ["骨盤矯正コース ¥6,600", "全身バランス調整 ¥5,500", "小顔矯正 ¥4,400"],
    relatedStoreSlugs: ["kyoto-kawaramachi-esthe-sakura", "kyoto-kawaramachi-biyoushitsu-rin"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kyoto-kawaramachi-esthe-sakura", slug: "kyoto-kawaramachi-esthe-sakura", name: "エステ 桜花 河原町", area: "河原町", category: "エステ",
    walkMinutes: 6, waitMinutes: 0, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["和漢アロマ", "完全予約制", "リフトアップ"],
    heroCopy: "和漢アロマで癒す京都発のビューティサロン。",
    faq: ["完全予約制です。", "和漢アロマは天然素材のみ使用しています。"],
    menuHighlights: ["和漢フェイシャル ¥9,900", "ボディアロマ90分 ¥12,000", "ブライダルコース ¥15,000"],
    relatedStoreSlugs: ["kyoto-kawaramachi-seitai-miyabi", "kyoto-kawaramachi-biyoushitsu-rin"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kyoto-kawaramachi-biyoushitsu-rin", slug: "kyoto-kawaramachi-biyoushitsu-rin", name: "hair room 凛 河原町", area: "河原町", category: "美容室",
    walkMinutes: 2, waitMinutes: 5, lastOrderAt: "19:30", isOpen: true,
    benefitTags: ["マンツーマン施術", "オーガニック", "メンズOK"],
    heroCopy: "一人ひとりに向き合うマンツーマン美容室。",
    faq: ["マンツーマンのため予約優先です。", "オーガニックカラー取り扱いあり。"],
    menuHighlights: ["カット ¥5,500", "オーガニックカラー ¥7,700", "ヘッドスパ ¥3,300"],
    relatedStoreSlugs: ["kyoto-kawaramachi-seitai-miyabi", "kyoto-kawaramachi-esthe-sakura"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kyoto-shijo-matcha-uji", slug: "kyoto-shijo-matcha-uji", name: "宇治園茶寮 四条店", area: "四条", category: "抹茶スイーツ",
    walkMinutes: 5, waitMinutes: 20, lastOrderAt: "17:30", isOpen: true,
    benefitTags: ["宇治抹茶", "映えスイーツ", "お土産OK"],
    heroCopy: "本場宇治抹茶を贅沢に使った極上スイーツ。",
    faq: ["テイクアウトも可能です。", "お土産用の箱詰めも承ります。"],
    menuHighlights: ["抹茶パフェ ¥1,200", "抹茶ティラミス ¥880", "濃茶アフォガート ¥780"],
    relatedStoreSlugs: ["kyoto-shijo-cafe-tsukikage", "kyoto-shijo-washoku-ichimon"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kyoto-kawaramachi-ramen-kitashiro", slug: "kyoto-kawaramachi-ramen-kitashiro", name: "麺処 北白川 河原町店", area: "河原町", category: "ラーメン",
    walkMinutes: 3, waitMinutes: 20, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["鶏白湯", "自家製麺", "深夜営業"],
    heroCopy: "濃厚鶏白湯と自家製麺が人気の京都ラーメン。",
    faq: ["大盛りは無料です。", "辛味噌トッピングが人気です。"],
    menuHighlights: ["鶏白湯ラーメン ¥900", "特製つけ麺 ¥1,050", "チャーシュー丼 ¥350"],
    relatedStoreSlugs: ["kyoto-gion-izakaya-kamogawa", "kyoto-shijo-cafe-tsukikage"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  // ── 名古屋（栄・名駅・大須） ──
  {
    id: "mock-nagoya-sakae-izakaya-yamachan", slug: "nagoya-sakae-izakaya-yamachan", name: "居酒屋 やま茶ん 栄店", area: "栄", category: "居酒屋",
    walkMinutes: 4, waitMinutes: 10, lastOrderAt: "23:30", isOpen: true,
    benefitTags: ["名古屋めし", "味噌おでん", "手羽先あり"],
    heroCopy: "名古屋めしを全制覇できる栄の人気居酒屋。",
    faq: ["名古屋めしセットが人気です。", "2階は貸切可能です。"],
    menuHighlights: ["名古屋めし5種盛り ¥1,980", "味噌おでん盛り合わせ ¥980", "どて煮 ¥680"],
    relatedStoreSlugs: ["nagoya-sakae-tebasaki-fuurin", "nagoya-sakae-yakiniku-nikuzo"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-nagoya-meieki-cafe-komeda", slug: "nagoya-meieki-cafe-komeda", name: "珈琲所 こめだ 名駅前店", area: "名駅", category: "カフェ",
    walkMinutes: 2, waitMinutes: 5, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["モーニング", "名古屋名物", "ゆったり席"],
    heroCopy: "名古屋式モーニングが楽しめる駅前カフェ。",
    faq: ["モーニングは11時まで無料サービスです。", "全席禁煙です。"],
    menuHighlights: ["ブレンドコーヒー ¥480", "シロノワール ¥680", "小倉トースト ¥520"],
    relatedStoreSlugs: ["nagoya-meieki-ramen-sugakiya", "nagoya-meieki-biyoushitsu-luce"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-nagoya-sakae-yakiniku-nikuzo", slug: "nagoya-sakae-yakiniku-nikuzo", name: "焼肉 肉蔵 栄本店", area: "栄", category: "焼肉",
    walkMinutes: 6, waitMinutes: 15, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["黒毛和牛", "ホルモン充実", "宴会OK"],
    heroCopy: "黒毛和牛とホルモンが自慢の栄の焼肉店。",
    faq: ["飲み放題付きコースあります。", "ホルモンは毎朝仕入れです。"],
    menuHighlights: ["和牛カルビ ¥1,480", "丸腸 ¥780", "名物壺漬けハラミ ¥1,280"],
    relatedStoreSlugs: ["nagoya-sakae-izakaya-yamachan", "nagoya-sakae-tebasaki-fuurin"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-nagoya-osu-seitai-genki", slug: "nagoya-osu-seitai-genki", name: "整体院 元気堂 大須店", area: "大須", category: "整体",
    walkMinutes: 5, waitMinutes: 0, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["初回割引", "猫背矯正", "学生割あり"],
    heroCopy: "大須商店街すぐの猫背矯正が得意な整体院。",
    faq: ["学生証提示で20%OFFです。", "初回は問診込みで90分です。"],
    menuHighlights: ["全身整体60分 ¥4,400", "猫背矯正コース ¥5,500", "足つぼ30分 ¥2,200"],
    relatedStoreSlugs: ["nagoya-osu-massage-tsubo", "nagoya-meieki-biyoushitsu-luce"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-nagoya-meieki-biyoushitsu-luce", slug: "nagoya-meieki-biyoushitsu-luce", name: "hair salon Luce 名駅店", area: "名駅", category: "美容室",
    walkMinutes: 3, waitMinutes: 5, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["駅直結", "イルミナカラー", "メンズ歓迎"],
    heroCopy: "名駅直結で通いやすいトレンドサロン。",
    faq: ["メンズカットも人気です。", "イルミナカラーで透明感を。"],
    menuHighlights: ["カット ¥4,950", "イルミナカラー ¥8,250", "パーマ+カット ¥11,000"],
    relatedStoreSlugs: ["nagoya-meieki-cafe-komeda", "nagoya-meieki-ramen-sugakiya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-nagoya-sakae-tebasaki-fuurin", slug: "nagoya-sakae-tebasaki-fuurin", name: "手羽先 風鈴 栄店", area: "栄", category: "手羽先",
    walkMinutes: 3, waitMinutes: 10, lastOrderAt: "23:00", isOpen: true,
    benefitTags: ["秘伝のタレ", "ビールに合う", "テイクアウトOK"],
    heroCopy: "秘伝のタレで焼く名古屋名物カリカリ手羽先。",
    faq: ["テイクアウトは10本から承ります。", "辛さ調節できます。"],
    menuHighlights: ["手羽先5本 ¥550", "手羽先10本 ¥1,000", "手羽元唐揚げ ¥680"],
    relatedStoreSlugs: ["nagoya-sakae-izakaya-yamachan", "nagoya-sakae-yakiniku-nikuzo"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-nagoya-meieki-ramen-sugakiya", slug: "nagoya-meieki-ramen-sugakiya", name: "麺屋 杉作 名駅店", area: "名駅", category: "ラーメン",
    walkMinutes: 1, waitMinutes: 15, lastOrderAt: "21:30", isOpen: true,
    benefitTags: ["台湾まぜそば", "にんにく増し", "ランチセット"],
    heroCopy: "名古屋発祥・台湾まぜそばが看板メニュー。",
    faq: ["にんにく抜きも対応可能です。", "追い飯は無料サービスです。"],
    menuHighlights: ["台湾まぜそば ¥900", "台湾ラーメン ¥850", "味噌カツ丼セット ¥1,100"],
    relatedStoreSlugs: ["nagoya-meieki-cafe-komeda", "nagoya-meieki-biyoushitsu-luce"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-nagoya-osu-massage-tsubo", slug: "nagoya-osu-massage-tsubo", name: "もみほぐし 壺 大須店", area: "大須", category: "マッサージ",
    walkMinutes: 8, waitMinutes: 0, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["60分2,980円", "予約なしOK", "深夜営業"],
    heroCopy: "大須で気軽に立ち寄れるリーズナブルもみほぐし。",
    faq: ["予約なしでもお待ちなく入れることが多いです。", "延長は10分単位で可能です。"],
    menuHighlights: ["全身もみほぐし60分 ¥2,980", "足つぼ40分 ¥2,480", "ヘッドマッサージ30分 ¥1,980"],
    relatedStoreSlugs: ["nagoya-osu-seitai-genki", "nagoya-sakae-izakaya-yamachan"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  // ── 福岡（天神・博多・中洲） ──
  {
    id: "mock-fukuoka-hakata-ramen-ichiran", slug: "fukuoka-hakata-ramen-ichiran", name: "博多麺道 一蘭丸 博多駅前", area: "博多", category: "ラーメン",
    walkMinutes: 2, waitMinutes: 25, lastOrderAt: "23:00", isOpen: true,
    benefitTags: ["濃厚豚骨", "替え玉無料", "一人席あり"],
    heroCopy: "博多駅前で味わう本場の濃厚豚骨ラーメン。",
    faq: ["替え玉は2玉まで無料です。", "麺の硬さは5段階から選べます。"],
    menuHighlights: ["豚骨ラーメン ¥790", "チャーシュー麺 ¥1,050", "明太子ご飯 ¥300"],
    relatedStoreSlugs: ["fukuoka-hakata-motsunabe-yamaya", "fukuoka-hakata-yakitori-torimasa"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-fukuoka-hakata-motsunabe-yamaya", slug: "fukuoka-hakata-motsunabe-yamaya", name: "もつ鍋 やまや 博多本店", area: "博多", category: "もつ鍋",
    walkMinutes: 5, waitMinutes: 20, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["明太子食べ放題", "コラーゲン", "〆のちゃんぽん"],
    heroCopy: "明太子食べ放題付きの博多もつ鍋専門店。",
    faq: ["明太子とご飯は食べ放題です。", "鍋の味は3種類から選べます。"],
    menuHighlights: ["もつ鍋（味噌）¥1,580", "もつ鍋（醤油）¥1,580", "〆のちゃんぽん麺 ¥350"],
    relatedStoreSlugs: ["fukuoka-hakata-ramen-ichiran", "fukuoka-nakasu-izakaya-hanamizuki"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-fukuoka-nakasu-izakaya-hanamizuki", slug: "fukuoka-nakasu-izakaya-hanamizuki", name: "酒房 花水木 中洲店", area: "中洲", category: "居酒屋",
    walkMinutes: 6, waitMinutes: 10, lastOrderAt: "23:30", isOpen: true,
    benefitTags: ["玄界灘鮮魚", "地酒豊富", "中洲屋台風"],
    heroCopy: "玄界灘の鮮魚と福岡の地酒を堪能できる酒房。",
    faq: ["刺身は毎朝市場から仕入れています。", "カウンター席は予約不要です。"],
    menuHighlights: ["刺身5種盛り ¥1,680", "ごまさば ¥880", "博多酢もつ ¥580"],
    relatedStoreSlugs: ["fukuoka-hakata-motsunabe-yamaya", "fukuoka-hakata-yakitori-torimasa"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-fukuoka-tenjin-cafe-musubi", slug: "fukuoka-tenjin-cafe-musubi", name: "Café むすび 天神店", area: "天神", category: "カフェ",
    walkMinutes: 3, waitMinutes: 5, lastOrderAt: "19:30", isOpen: true,
    benefitTags: ["あまおうスイーツ", "Wi-Fi完備", "テラス席"],
    heroCopy: "あまおう苺を使ったスイーツが自慢の天神カフェ。",
    faq: ["あまおうパフェは季節限定です。", "テラス席はペットOKです。"],
    menuHighlights: ["あまおうパフェ ¥1,200", "抹茶ラテ ¥580", "フレンチトースト ¥780"],
    relatedStoreSlugs: ["fukuoka-tenjin-seitai-genryu", "fukuoka-tenjin-esthe-bijin"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-fukuoka-tenjin-seitai-genryu", slug: "fukuoka-tenjin-seitai-genryu", name: "整体 源流 天神店", area: "天神", category: "整体",
    walkMinutes: 4, waitMinutes: 0, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["スポーツ整体", "初回割引", "天神駅近"],
    heroCopy: "スポーツ後の体メンテナンスに最適な整体院。",
    faq: ["スポーツ選手も多く通っています。", "初回カウンセリングは無料です。"],
    menuHighlights: ["スポーツ整体60分 ¥5,500", "全身調整40分 ¥3,850", "産後骨盤矯正 ¥6,600"],
    relatedStoreSlugs: ["fukuoka-tenjin-cafe-musubi", "fukuoka-tenjin-esthe-bijin"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-fukuoka-hakata-yakitori-torimasa", slug: "fukuoka-hakata-yakitori-torimasa", name: "焼鳥 鳥政 博多店", area: "博多", category: "焼鳥",
    walkMinutes: 3, waitMinutes: 15, lastOrderAt: "22:30", isOpen: true,
    benefitTags: ["備長炭焼き", "鶏刺しあり", "コスパ抜群"],
    heroCopy: "備長炭で丁寧に焼く博多の本格焼鳥。",
    faq: ["鶏刺しは新鮮な朝引き鶏を使用。", "焼鳥は1本から注文可能です。"],
    menuHighlights: ["おまかせ串5本 ¥800", "鶏刺し盛り合わせ ¥980", "つくね（月見）¥220"],
    relatedStoreSlugs: ["fukuoka-hakata-ramen-ichiran", "fukuoka-nakasu-izakaya-hanamizuki"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-fukuoka-tenjin-esthe-bijin", slug: "fukuoka-tenjin-esthe-bijin", name: "エステ 美人百花 天神店", area: "天神", category: "エステ",
    walkMinutes: 5, waitMinutes: 0, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["痩身エステ", "初回体験あり", "駅近"],
    heroCopy: "天神で結果にこだわる本格痩身エステサロン。",
    faq: ["初回体験は3,980円です。", "コース契約の無理な勧誘はありません。"],
    menuHighlights: ["キャビテーション60分 ¥9,800", "ラジオ波+EMS ¥8,800", "セルライトケア ¥7,700"],
    relatedStoreSlugs: ["fukuoka-tenjin-seitai-genryu", "fukuoka-tenjin-biyoushitsu-aile"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-fukuoka-tenjin-biyoushitsu-aile", slug: "fukuoka-tenjin-biyoushitsu-aile", name: "hair salon Aile 天神店", area: "天神", category: "美容室",
    walkMinutes: 4, waitMinutes: 5, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["韓国ヘア", "ダメージレス", "学割あり"],
    heroCopy: "韓国ヘアが得意な天神の人気サロン。",
    faq: ["学生証提示で全メニュー15%OFFです。", "韓国式パーマも対応しています。"],
    menuHighlights: ["カット ¥4,400", "韓国式カラー ¥7,700", "髪質改善トリートメント ¥6,600"],
    relatedStoreSlugs: ["fukuoka-tenjin-esthe-bijin", "fukuoka-tenjin-cafe-musubi"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  // ── 札幌（すすきの・大通・狸小路） ──
  {
    id: "mock-sapporo-susukino-jingisukan-daruma", slug: "sapporo-susukino-jingisukan-daruma", name: "ジンギスカン だるま すすきの本店", area: "すすきの", category: "ジンギスカン",
    walkMinutes: 2, waitMinutes: 30, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["生ラム", "炭火七輪", "行列人気店"],
    heroCopy: "すすきので半世紀愛される生ラムジンギスカン。",
    faq: ["待ち時間は30分前後です。", "生ラムは数量限定です。"],
    menuHighlights: ["生ラムジンギスカン ¥1,190", "特上ラムロース ¥1,490", "野菜盛り合わせ ¥480"],
    relatedStoreSlugs: ["sapporo-susukino-izakaya-kitanoaji", "sapporo-susukino-kaisen-hokkai"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sapporo-susukino-kaisen-hokkai", slug: "sapporo-susukino-kaisen-hokkai", name: "海鮮処 北海 すすきの店", area: "すすきの", category: "海鮮",
    walkMinutes: 4, waitMinutes: 15, lastOrderAt: "22:30", isOpen: true,
    benefitTags: ["朝獲れ直送", "ウニ・カニ", "個室あり"],
    heroCopy: "北海道の朝獲れ海鮮を堪能する贅沢な時間。",
    faq: ["ウニとカニは時価です。", "個室は4名様から利用可能です。"],
    menuHighlights: ["海鮮丼（特上）¥2,980", "活カニ刺し ¥時価", "ほたてバター焼き ¥880"],
    relatedStoreSlugs: ["sapporo-susukino-jingisukan-daruma", "sapporo-susukino-izakaya-kitanoaji"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sapporo-odori-ramen-shirakaba", slug: "sapporo-odori-ramen-shirakaba", name: "札幌麺屋 白樺 大通店", area: "大通", category: "ラーメン",
    walkMinutes: 3, waitMinutes: 20, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["味噌ラーメン", "バターコーン", "札幌名物"],
    heroCopy: "濃厚味噌スープが体に染みる札幌ラーメン。",
    faq: ["一番人気は味噌バターコーンです。", "辛味噌に変更可能です。"],
    menuHighlights: ["味噌ラーメン ¥900", "味噌バターコーン ¥1,000", "海鮮塩ラーメン ¥950"],
    relatedStoreSlugs: ["sapporo-odori-cafe-yukiusagi", "sapporo-odori-soupcurry-magic"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sapporo-odori-cafe-yukiusagi", slug: "sapporo-odori-cafe-yukiusagi", name: "カフェ 雪うさぎ 大通店", area: "大通", category: "カフェ",
    walkMinutes: 5, waitMinutes: 5, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["北海道牛乳", "スイーツ充実", "テラス席"],
    heroCopy: "北海道産ミルクを贅沢に使ったスイーツカフェ。",
    faq: ["季節限定メニューがあります。", "テイクアウト可能です。"],
    menuHighlights: ["北海道ミルクソフト ¥480", "夕張メロンパフェ ¥1,100", "濃厚カフェラテ ¥550"],
    relatedStoreSlugs: ["sapporo-odori-ramen-shirakaba", "sapporo-odori-soupcurry-magic"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sapporo-susukino-izakaya-kitanoaji", slug: "sapporo-susukino-izakaya-kitanoaji", name: "居酒屋 北の味 すすきの", area: "すすきの", category: "居酒屋",
    walkMinutes: 3, waitMinutes: 10, lastOrderAt: "23:30", isOpen: true,
    benefitTags: ["北海道食材", "日本酒豊富", "深夜営業"],
    heroCopy: "北海道の旬食材を日本酒と楽しむすすきの居酒屋。",
    faq: ["ラストオーダーは23:30です。", "北海道の地酒を20種以上揃えています。"],
    menuHighlights: ["ザンギ（鶏唐揚げ）¥680", "じゃがバター ¥480", "ラムしゃぶ ¥1,480"],
    relatedStoreSlugs: ["sapporo-susukino-jingisukan-daruma", "sapporo-susukino-kaisen-hokkai"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sapporo-tanukikoji-seitai-hokushin", slug: "sapporo-tanukikoji-seitai-hokushin", name: "整体 北心 狸小路店", area: "狸小路", category: "整体",
    walkMinutes: 6, waitMinutes: 0, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["冷え性改善", "温活整体", "女性人気"],
    heroCopy: "北海道の冷えに負けない体をつくる温活整体。",
    faq: ["温熱療法を取り入れた施術です。", "初回は40%OFFでお試し可能です。"],
    menuHighlights: ["温活整体60分 ¥5,500", "冷え性改善コース ¥6,600", "ホットストーン30分 ¥3,300"],
    relatedStoreSlugs: ["sapporo-tanukikoji-biyoushitsu-north", "sapporo-odori-cafe-yukiusagi"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sapporo-odori-soupcurry-magic", slug: "sapporo-odori-soupcurry-magic", name: "スープカレー MAGIC 大通店", area: "大通", category: "スープカレー",
    walkMinutes: 4, waitMinutes: 15, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["20種のスパイス", "辛さ選択", "野菜たっぷり"],
    heroCopy: "20種のスパイスが香る札幌スープカレーの名店。",
    faq: ["辛さは1〜10まで選べます。", "ライスの量は無料で調整できます。"],
    menuHighlights: ["チキンスープカレー ¥1,200", "野菜たっぷりカレー ¥1,100", "ラムカレー ¥1,350"],
    relatedStoreSlugs: ["sapporo-odori-ramen-shirakaba", "sapporo-odori-cafe-yukiusagi"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sapporo-tanukikoji-biyoushitsu-north", slug: "sapporo-tanukikoji-biyoushitsu-north", name: "hair studio North 狸小路", area: "狸小路", category: "美容室",
    walkMinutes: 7, waitMinutes: 5, lastOrderAt: "18:30", isOpen: true,
    benefitTags: ["ショートヘア得意", "頭皮ケア", "駅近"],
    heroCopy: "ショートヘアの似合わせカットが評判の美容室。",
    faq: ["ショートヘア専門のスタイリストが在籍。", "頭皮診断を無料で実施しています。"],
    menuHighlights: ["カット ¥4,400", "頭皮ケアコース ¥6,600", "カラー+カット ¥8,800"],
    relatedStoreSlugs: ["sapporo-tanukikoji-seitai-hokushin", "sapporo-odori-cafe-yukiusagi"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  // ── 横浜（みなとみらい・中華街・元町） ──
  {
    id: "mock-yokohama-chinatown-chuuka-ryu", slug: "yokohama-chinatown-chuuka-ryu", name: "中華菜館 龍 中華街本店", area: "中華街", category: "中華",
    walkMinutes: 3, waitMinutes: 20, lastOrderAt: "21:30", isOpen: true,
    benefitTags: ["本格四川", "食べ放題あり", "老舗"],
    heroCopy: "横浜中華街で60年続く本格四川料理の老舗。",
    faq: ["食べ放題コースは120分制です。", "辛さの調節可能です。"],
    menuHighlights: ["麻婆豆腐 ¥1,100", "小籠包6個 ¥880", "北京ダック ¥2,200"],
    relatedStoreSlugs: ["yokohama-chinatown-ramen-ryuou", "yokohama-motomachi-cafe-harbor"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-yokohama-motomachi-cafe-harbor", slug: "yokohama-motomachi-cafe-harbor", name: "Café Harbor 元町店", area: "元町", category: "カフェ",
    walkMinutes: 5, waitMinutes: 5, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["港の見えるカフェ", "焼き立てスコーン", "テラス席"],
    heroCopy: "港を望むテラスで焼き立てスコーンとコーヒーを。",
    faq: ["テラス席は天候により利用不可の場合があります。", "スコーンは毎朝手作りです。"],
    menuHighlights: ["スペシャルティコーヒー ¥550", "焼き立てスコーンセット ¥880", "季節のタルト ¥680"],
    relatedStoreSlugs: ["yokohama-motomachi-italian-vela", "yokohama-motomachi-biyoushitsu-bloom"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-yokohama-motomachi-italian-vela", slug: "yokohama-motomachi-italian-vela", name: "Trattoria Vela 元町", area: "元町", category: "イタリアン",
    walkMinutes: 7, waitMinutes: 15, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["手打ちパスタ", "ワイン充実", "記念日向き"],
    heroCopy: "元町の路地裏に佇む手打ちパスタのトラットリア。",
    faq: ["記念日プレートのご用意可能です。", "ワインはイタリア産を中心に50種以上。"],
    menuHighlights: ["手打ちボロネーゼ ¥1,680", "鮮魚のカルパッチョ ¥1,280", "ティラミス ¥680"],
    relatedStoreSlugs: ["yokohama-motomachi-cafe-harbor", "yokohama-motomachi-esthe-marine"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-yokohama-minatomirai-seitai-bay", slug: "yokohama-minatomirai-seitai-bay", name: "整体院 Bay みなとみらい", area: "みなとみらい", category: "整体",
    walkMinutes: 4, waitMinutes: 0, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["デスクワーク改善", "初回割引", "眺望良し"],
    heroCopy: "みなとみらいの景色を見ながら体をリセット。",
    faq: ["デスクワーカー向けのコースが人気です。", "初回は30%OFFです。"],
    menuHighlights: ["全身整体60分 ¥5,500", "肩・首集中コース ¥4,400", "ストレッチ指導付き ¥6,600"],
    relatedStoreSlugs: ["yokohama-minatomirai-izakaya-kaizoku", "yokohama-motomachi-esthe-marine"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-yokohama-motomachi-esthe-marine", slug: "yokohama-motomachi-esthe-marine", name: "エステ Marine 元町店", area: "元町", category: "エステ",
    walkMinutes: 6, waitMinutes: 0, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["海洋ミネラル", "デトックス", "完全個室"],
    heroCopy: "海洋由来の成分で肌を蘇らせるエステサロン。",
    faq: ["海洋ミネラルパックが人気メニューです。", "完全個室でリラックスできます。"],
    menuHighlights: ["海洋ミネラルフェイシャル ¥9,900", "デトックスボディ90分 ¥13,200", "ブライダルコース ¥16,500"],
    relatedStoreSlugs: ["yokohama-motomachi-italian-vela", "yokohama-motomachi-biyoushitsu-bloom"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-yokohama-motomachi-biyoushitsu-bloom", slug: "yokohama-motomachi-biyoushitsu-bloom", name: "hair salon Bloom 元町", area: "元町", category: "美容室",
    walkMinutes: 8, waitMinutes: 5, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["大人女性向け", "白髪染め得意", "半個室"],
    heroCopy: "大人女性のための上質な元町プライベートサロン。",
    faq: ["半個室で周りを気にせず施術。", "白髪を活かしたデザインカラーが人気。"],
    menuHighlights: ["カット ¥5,500", "白髪ぼかしカラー ¥9,900", "ヘッドスパ ¥4,400"],
    relatedStoreSlugs: ["yokohama-motomachi-cafe-harbor", "yokohama-motomachi-esthe-marine"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-yokohama-minatomirai-izakaya-kaizoku", slug: "yokohama-minatomirai-izakaya-kaizoku", name: "海賊酒場 みなとみらい店", area: "みなとみらい", category: "居酒屋",
    walkMinutes: 5, waitMinutes: 10, lastOrderAt: "23:00", isOpen: true,
    benefitTags: ["夜景が見える", "海鮮メイン", "飲み放題"],
    heroCopy: "みなとみらいの夜景を見ながら海鮮を堪能。",
    faq: ["窓際席は予約がおすすめです。", "飲み放題は2時間制です。"],
    menuHighlights: ["刺身5点盛り ¥1,580", "海鮮アヒージョ ¥980", "名物海賊鍋 ¥2,480"],
    relatedStoreSlugs: ["yokohama-minatomirai-seitai-bay", "yokohama-chinatown-chuuka-ryu"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-yokohama-chinatown-ramen-ryuou", slug: "yokohama-chinatown-ramen-ryuou", name: "拉麺 龍王 中華街", area: "中華街", category: "ラーメン",
    walkMinutes: 2, waitMinutes: 20, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["横浜家系", "濃厚豚骨醤油", "ライス無料"],
    heroCopy: "中華街入口で味わう濃厚家系ラーメン。",
    faq: ["ライスは無料サービスです。", "麺の硬さ・味の濃さ・油の量を選べます。"],
    menuHighlights: ["家系ラーメン ¥850", "チャーシューメン ¥1,100", "ほうれん草増し ¥100"],
    relatedStoreSlugs: ["yokohama-chinatown-chuuka-ryu", "yokohama-minatomirai-izakaya-kaizoku"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  // ── 神戸（三宮・元町・北野） ──
  {
    id: "mock-kobe-sannomiya-yoshoku-hokkyokusei", slug: "kobe-sannomiya-yoshoku-hokkyokusei", name: "洋食 北極星 三宮本店", area: "三宮", category: "洋食",
    walkMinutes: 3, waitMinutes: 15, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["オムライス", "老舗洋食", "デミグラス"],
    heroCopy: "創業50年のデミグラスオムライスが看板の洋食店。",
    faq: ["オムライスは注文後に一つずつ焼きます。", "テイクアウト可能です。"],
    menuHighlights: ["デミグラスオムライス ¥1,100", "ビーフシチュー ¥1,680", "海老フライ定食 ¥1,380"],
    relatedStoreSlugs: ["kobe-sannomiya-izakaya-minato", "kobe-sannomiya-yakiniku-kobeya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kobe-kitano-cafe-ijinkan", slug: "kobe-kitano-cafe-ijinkan", name: "Café 異人館 北野店", area: "北野", category: "カフェ",
    walkMinutes: 10, waitMinutes: 5, lastOrderAt: "18:00", isOpen: true,
    benefitTags: ["異国情緒", "自家焙煎", "レトロ建築"],
    heroCopy: "北野の異人館エリアで味わう自家焙煎コーヒー。",
    faq: ["建物は登録有形文化財です。", "ケーキは毎日手作りです。"],
    menuHighlights: ["異人館ブレンド ¥600", "神戸チーズケーキ ¥650", "季節のフルーツタルト ¥780"],
    relatedStoreSlugs: ["kobe-kitano-panya-flour", "kobe-sannomiya-yoshoku-hokkyokusei"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kobe-sannomiya-yakiniku-kobeya", slug: "kobe-sannomiya-yakiniku-kobeya", name: "焼肉 神戸屋 三宮店", area: "三宮", category: "焼肉",
    walkMinutes: 4, waitMinutes: 20, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["神戸牛", "ランチ営業", "カウンター焼肉"],
    heroCopy: "A5神戸牛をカウンターで楽しむ贅沢焼肉。",
    faq: ["ランチタイムはお得なセットがあります。", "神戸牛証明書を掲示しています。"],
    menuHighlights: ["神戸牛特選カルビ ¥2,980", "神戸牛赤身ステーキ ¥3,500", "ランチセット ¥1,980"],
    relatedStoreSlugs: ["kobe-sannomiya-yoshoku-hokkyokusei", "kobe-sannomiya-izakaya-minato"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kobe-motomachi-seitai-kaihou", slug: "kobe-motomachi-seitai-kaihou", name: "整体 解放 元町店", area: "元町", category: "整体",
    walkMinutes: 5, waitMinutes: 0, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["肩こり専門", "姿勢分析", "初回割引"],
    heroCopy: "AIによる姿勢分析で根本改善する元町の整体。",
    faq: ["AIカメラで姿勢を分析します。", "初回は50%OFFです。"],
    menuHighlights: ["姿勢分析+整体60分 ¥6,600", "肩こり解消コース ¥5,500", "O脚矯正 ¥4,400"],
    relatedStoreSlugs: ["kobe-motomachi-chuuka-chuka", "kobe-motomachi-biyoushitsu-port"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kobe-kitano-panya-flour", slug: "kobe-kitano-panya-flour", name: "Boulangerie Flour 北野店", area: "北野", category: "パン屋",
    walkMinutes: 12, waitMinutes: 10, lastOrderAt: "17:00", isOpen: true,
    benefitTags: ["天然酵母", "イートイン可", "人気食パン"],
    heroCopy: "天然酵母にこだわる北野の人気ブーランジェリー。",
    faq: ["食パンは午前中に売り切れることがあります。", "イートインスペースあり。"],
    menuHighlights: ["天然酵母食パン ¥480", "クロワッサン ¥320", "カレーパン ¥280"],
    relatedStoreSlugs: ["kobe-kitano-cafe-ijinkan", "kobe-sannomiya-yoshoku-hokkyokusei"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kobe-motomachi-biyoushitsu-port", slug: "kobe-motomachi-biyoushitsu-port", name: "hair salon Port 元町", area: "元町", category: "美容室",
    walkMinutes: 6, waitMinutes: 5, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["外国人風カラー", "ハイライト", "港町おしゃれ"],
    heroCopy: "外国人風カラーが得意な元町の海辺サロン。",
    faq: ["ブリーチなしのハイライトも可能です。", "メンズカットも人気です。"],
    menuHighlights: ["カット ¥5,000", "外国人風カラー ¥9,900", "バレイヤージュ ¥13,200"],
    relatedStoreSlugs: ["kobe-motomachi-seitai-kaihou", "kobe-kitano-cafe-ijinkan"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kobe-sannomiya-izakaya-minato", slug: "kobe-sannomiya-izakaya-minato", name: "酒場 湊 三宮店", area: "三宮", category: "居酒屋",
    walkMinutes: 2, waitMinutes: 10, lastOrderAt: "23:30", isOpen: true,
    benefitTags: ["明石焼き", "地酒", "アットホーム"],
    heroCopy: "明石焼きと灘の地酒を楽しむ三宮の酒場。",
    faq: ["明石焼きは注文後に焼き上げます。", "日本酒は灘五郷の地酒が中心です。"],
    menuHighlights: ["明石焼き ¥780", "灘の地酒飲み比べ ¥1,200", "神戸牛すじ煮込み ¥880"],
    relatedStoreSlugs: ["kobe-sannomiya-yoshoku-hokkyokusei", "kobe-sannomiya-yakiniku-kobeya"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-kobe-motomachi-chuuka-chuka", slug: "kobe-motomachi-chuuka-chuka", name: "中華 長安 元町店", area: "元町", category: "中華",
    walkMinutes: 4, waitMinutes: 15, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["点心", "飲茶ランチ", "南京町"],
    heroCopy: "南京町で本格飲茶が楽しめる中華料理店。",
    faq: ["飲茶ランチは平日限定です。", "テイクアウト豚まんが人気です。"],
    menuHighlights: ["飲茶セット ¥1,680", "海老蒸し餃子 ¥680", "五目あんかけ焼きそば ¥1,100"],
    relatedStoreSlugs: ["kobe-motomachi-seitai-kaihou", "kobe-motomachi-biyoushitsu-port"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  // ── 仙台（国分町・一番町） ──
  {
    id: "mock-sendai-kokubuncho-gyutan-rikyu", slug: "sendai-kokubuncho-gyutan-rikyu", name: "牛タン 利休 国分町本店", area: "国分町", category: "牛タン",
    walkMinutes: 3, waitMinutes: 20, lastOrderAt: "21:30", isOpen: true,
    benefitTags: ["厚切り牛タン", "麦めし", "仙台名物"],
    heroCopy: "肉厚の牛タン焼きと麦めしの仙台王道セット。",
    faq: ["ランチタイムは行列になることがあります。", "テイクアウト弁当もあります。"],
    menuHighlights: ["牛タン定食（4枚8切）¥1,800", "特厚牛タン定食 ¥2,500", "牛タンシチュー ¥1,200"],
    relatedStoreSlugs: ["sendai-kokubuncho-izakaya-dateya", "sendai-ichibancho-ramen-jiro"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sendai-kokubuncho-izakaya-dateya", slug: "sendai-kokubuncho-izakaya-dateya", name: "居酒屋 伊達屋 国分町", area: "国分町", category: "居酒屋",
    walkMinutes: 2, waitMinutes: 10, lastOrderAt: "23:30", isOpen: true,
    benefitTags: ["仙台せり鍋", "地酒", "深夜営業"],
    heroCopy: "仙台名物せり鍋と宮城の地酒を楽しむ居酒屋。",
    faq: ["せり鍋は冬季限定メニューです。", "宮城県産の日本酒を中心に揃えています。"],
    menuHighlights: ["せり鍋 ¥1,580", "牛タンつくね ¥680", "宮城地酒飲み比べ ¥1,300"],
    relatedStoreSlugs: ["sendai-kokubuncho-gyutan-rikyu", "sendai-ichibancho-ramen-jiro"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sendai-ichibancho-ramen-jiro", slug: "sendai-ichibancho-ramen-jiro", name: "麺屋 次郎 一番町店", area: "一番町", category: "ラーメン",
    walkMinutes: 4, waitMinutes: 15, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["辛味噌ラーメン", "自家製麺", "ボリューム満点"],
    heroCopy: "自家製太麺と辛味噌が旨い仙台のラーメン店。",
    faq: ["辛さは3段階から選べます。", "大盛り無料です。"],
    menuHighlights: ["辛味噌ラーメン ¥900", "特製つけ麺 ¥1,000", "チャーシュー丼 ¥380"],
    relatedStoreSlugs: ["sendai-kokubuncho-gyutan-rikyu", "sendai-ichibancho-cafe-keyaki"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sendai-ichibancho-cafe-keyaki", slug: "sendai-ichibancho-cafe-keyaki", name: "カフェ 欅 一番町", area: "一番町", category: "カフェ",
    walkMinutes: 5, waitMinutes: 5, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["ずんだスイーツ", "ケヤキ並木沿い", "読書向き"],
    heroCopy: "ケヤキ並木を眺めながらずんだスイーツを。",
    faq: ["ずんだシェイクが一番人気です。", "Wi-Fi・電源完備です。"],
    menuHighlights: ["ずんだシェイク ¥580", "ずんだパフェ ¥880", "ドリップコーヒー ¥480"],
    relatedStoreSlugs: ["sendai-ichibancho-ramen-jiro", "sendai-ichibancho-seitai-aoba"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sendai-ichibancho-seitai-aoba", slug: "sendai-ichibancho-seitai-aoba", name: "整体院 青葉 一番町", area: "一番町", category: "整体",
    walkMinutes: 6, waitMinutes: 0, lastOrderAt: "20:30", isOpen: true,
    benefitTags: ["腰痛専門", "温熱療法", "初回割引"],
    heroCopy: "仙台の腰痛改善実績No.1の整体院。",
    faq: ["温熱療法を併用した施術です。", "初回は40%OFFです。"],
    menuHighlights: ["腰痛改善コース ¥6,600", "全身整体60分 ¥5,500", "温熱+整体90分 ¥8,800"],
    relatedStoreSlugs: ["sendai-ichibancho-cafe-keyaki", "sendai-ichibancho-biyoushitsu-irodori"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-sendai-ichibancho-biyoushitsu-irodori", slug: "sendai-ichibancho-biyoushitsu-irodori", name: "hair salon 彩 一番町", area: "一番町", category: "美容室",
    walkMinutes: 3, waitMinutes: 5, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["ナチュラルスタイル", "縮毛矯正", "駅近"],
    heroCopy: "ナチュラルな仕上がりが得意な一番町の美容室。",
    faq: ["縮毛矯正の持ちが良いと好評です。", "メンズカットも対応しています。"],
    menuHighlights: ["カット ¥4,400", "縮毛矯正 ¥13,200", "カラー+カット ¥8,800"],
    relatedStoreSlugs: ["sendai-ichibancho-seitai-aoba", "sendai-ichibancho-cafe-keyaki"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  // ── 広島（本通り・流川） ──
  {
    id: "mock-hiroshima-hondori-okonomiyaki-teppei", slug: "hiroshima-hondori-okonomiyaki-teppei", name: "お好み焼き 鉄平 本通り店", area: "本通り", category: "お好み焼き",
    walkMinutes: 2, waitMinutes: 20, lastOrderAt: "21:00", isOpen: true,
    benefitTags: ["広島風", "そば入り", "目の前で焼く"],
    heroCopy: "目の前の鉄板で焼く広島風お好み焼きの名店。",
    faq: ["そばかうどんを選べます。", "テイクアウトも可能です。"],
    menuHighlights: ["肉玉そば ¥900", "スペシャル（海鮮入り）¥1,300", "ネギかけ ¥1,050"],
    relatedStoreSlugs: ["hiroshima-hondori-cafe-momiji", "hiroshima-nagarekawa-izakaya-seto"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-hiroshima-nagarekawa-izakaya-seto", slug: "hiroshima-nagarekawa-izakaya-seto", name: "酒処 瀬戸 流川店", area: "流川", category: "居酒屋",
    walkMinutes: 5, waitMinutes: 10, lastOrderAt: "23:00", isOpen: true,
    benefitTags: ["瀬戸内鮮魚", "牡蠣料理", "広島地酒"],
    heroCopy: "瀬戸内の鮮魚と広島牡蠣を味わう流川の酒処。",
    faq: ["牡蠣は季節により提供なしの場合があります。", "広島の地酒を10種以上揃えています。"],
    menuHighlights: ["焼き牡蠣3個 ¥780", "瀬戸内刺身盛り ¥1,480", "穴子の白焼き ¥1,100"],
    relatedStoreSlugs: ["hiroshima-hondori-okonomiyaki-teppei", "hiroshima-nagarekawa-ramen-kurobuchi"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-hiroshima-hondori-cafe-momiji", slug: "hiroshima-hondori-cafe-momiji", name: "カフェ もみじ 本通り", area: "本通り", category: "カフェ",
    walkMinutes: 3, waitMinutes: 5, lastOrderAt: "18:30", isOpen: true,
    benefitTags: ["もみじ饅頭", "抹茶ラテ", "お土産コーナー"],
    heroCopy: "焼きたてもみじ饅頭とドリンクのカフェ。",
    faq: ["焼きたてもみじ饅頭は店内限定です。", "お土産用の箱売りもあります。"],
    menuHighlights: ["焼きたてもみじ饅頭セット ¥680", "抹茶ラテ ¥550", "レモンスカッシュ ¥480"],
    relatedStoreSlugs: ["hiroshima-hondori-okonomiyaki-teppei", "hiroshima-hondori-seitai-hiroshima"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-hiroshima-hondori-seitai-hiroshima", slug: "hiroshima-hondori-seitai-hiroshima", name: "整体院 広島健康堂 本通り", area: "本通り", category: "整体",
    walkMinutes: 4, waitMinutes: 0, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["猫背改善", "学生割", "当日予約OK"],
    heroCopy: "本通りアーケード内で気軽に通える整体院。",
    faq: ["学生証提示で20%OFFです。", "当日予約もLINEから可能です。"],
    menuHighlights: ["全身整体60分 ¥4,950", "猫背矯正コース ¥5,500", "足つぼ30分 ¥2,200"],
    relatedStoreSlugs: ["hiroshima-hondori-cafe-momiji", "hiroshima-hondori-biyoushitsu-olive"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-hiroshima-nagarekawa-ramen-kurobuchi", slug: "hiroshima-nagarekawa-ramen-kurobuchi", name: "麺屋 黒淵 流川店", area: "流川", category: "ラーメン",
    walkMinutes: 6, waitMinutes: 15, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["尾道ラーメン風", "背脂醤油", "〆の一杯"],
    heroCopy: "飲んだ後の〆に最高な背脂醤油ラーメン。",
    faq: ["深夜2時まで営業しています。", "ミニラーメンもあります。"],
    menuHighlights: ["背脂醤油ラーメン ¥850", "汁なし担々麺 ¥900", "ミニチャーシュー丼 ¥300"],
    relatedStoreSlugs: ["hiroshima-nagarekawa-izakaya-seto", "hiroshima-hondori-okonomiyaki-teppei"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-hiroshima-hondori-biyoushitsu-olive", slug: "hiroshima-hondori-biyoushitsu-olive", name: "hair salon Olive 本通り", area: "本通り", category: "美容室",
    walkMinutes: 3, waitMinutes: 5, lastOrderAt: "19:00", isOpen: true,
    benefitTags: ["パーマ得意", "ダメージケア", "キッズOK"],
    heroCopy: "ダメージレスなパーマが人気の本通りサロン。",
    faq: ["キッズカットは3歳から対応。", "デジタルパーマが人気です。"],
    menuHighlights: ["カット ¥4,400", "デジタルパーマ ¥9,900", "カラー+トリートメント ¥8,800"],
    relatedStoreSlugs: ["hiroshima-hondori-seitai-hiroshima", "hiroshima-hondori-cafe-momiji"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  // ── 沖縄（那覇・国際通り） ──
  {
    id: "mock-okinawa-kokusai-okinawa-ryouri-umikaji", slug: "okinawa-kokusai-okinawa-ryouri-umikaji", name: "沖縄料理 海風 国際通り店", area: "国際通り", category: "沖縄料理",
    walkMinutes: 2, waitMinutes: 15, lastOrderAt: "22:00", isOpen: true,
    benefitTags: ["ゴーヤーチャンプルー", "泡盛", "島唄ライブ"],
    heroCopy: "島唄ライブを聴きながら楽しむ本場の沖縄料理。",
    faq: ["島唄ライブは毎晩19時と21時の2回です。", "泡盛は30種類以上揃えています。"],
    menuHighlights: ["ゴーヤーチャンプルー ¥880", "ラフテー ¥980", "海ぶどうサラダ ¥680"],
    relatedStoreSlugs: ["okinawa-kokusai-steak-88", "okinawa-kokusai-izakaya-shimakaze"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-okinawa-kokusai-steak-88", slug: "okinawa-kokusai-steak-88", name: "ステーキハウス 88 国際通り店", area: "国際通り", category: "ステーキ",
    walkMinutes: 3, waitMinutes: 20, lastOrderAt: "22:30", isOpen: true,
    benefitTags: ["1000円ステーキ", "鉄板焼き", "沖縄牛"],
    heroCopy: "沖縄のステーキ文化を体感する老舗鉄板焼き。",
    faq: ["1000円ステーキはランチ限定です。", "A5沖縄牛のコースもあります。"],
    menuHighlights: ["テンダーロインステーキ ¥2,480", "沖縄牛サーロイン ¥3,980", "ランチステーキ ¥1,000"],
    relatedStoreSlugs: ["okinawa-kokusai-okinawa-ryouri-umikaji", "okinawa-kokusai-izakaya-shimakaze"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-okinawa-naha-cafe-churamui", slug: "okinawa-naha-cafe-churamui", name: "Café ちゅら杜 那覇店", area: "那覇", category: "カフェ",
    walkMinutes: 7, waitMinutes: 5, lastOrderAt: "18:00", isOpen: true,
    benefitTags: ["マンゴースイーツ", "海が見える", "テラス席"],
    heroCopy: "沖縄マンゴーを贅沢に使ったトロピカルカフェ。",
    faq: ["マンゴーは季節により沖縄県産を使用。", "テラス席からは海が見えます。"],
    menuHighlights: ["マンゴーかき氷 ¥980", "トロピカルスムージー ¥680", "紅芋タルト ¥480"],
    relatedStoreSlugs: ["okinawa-naha-seitai-niraikanai", "okinawa-naha-biyoushitsu-plumeria"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-okinawa-naha-seitai-niraikanai", slug: "okinawa-naha-seitai-niraikanai", name: "整体 ニライカナイ 那覇店", area: "那覇", category: "整体",
    walkMinutes: 5, waitMinutes: 0, lastOrderAt: "20:00", isOpen: true,
    benefitTags: ["旅行疲れに", "アロマ整体", "当日OK"],
    heroCopy: "旅行疲れを癒すアロマ整体で沖縄リフレッシュ。",
    faq: ["観光途中でも気軽にお立ち寄りください。", "アロマオイルは沖縄産を使用。"],
    menuHighlights: ["アロマ整体60分 ¥5,500", "全身ほぐし40分 ¥3,300", "フットケア30分 ¥2,200"],
    relatedStoreSlugs: ["okinawa-naha-cafe-churamui", "okinawa-naha-biyoushitsu-plumeria"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-okinawa-kokusai-izakaya-shimakaze", slug: "okinawa-kokusai-izakaya-shimakaze", name: "島風酒場 国際通り店", area: "国際通り", category: "居酒屋",
    walkMinutes: 4, waitMinutes: 10, lastOrderAt: "23:30", isOpen: true,
    benefitTags: ["オリオンビール", "島料理", "三線ライブ"],
    heroCopy: "オリオンビールと島料理で沖縄の夜を満喫。",
    faq: ["三線ライブは金・土曜の20時からです。", "飲み放題コースあります。"],
    menuHighlights: ["島らっきょう天ぷら ¥580", "ソーキそば ¥780", "もずく酢 ¥380"],
    relatedStoreSlugs: ["okinawa-kokusai-okinawa-ryouri-umikaji", "okinawa-kokusai-steak-88"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
    reliabilityEvidence: null, reliabilityUpdatedAt: null, replySlaSnapshot: "通常5分以内", badgeLabel: "LINE相談しやすい掲載店"
  },
  {
    id: "mock-okinawa-naha-biyoushitsu-plumeria", slug: "okinawa-naha-biyoushitsu-plumeria", name: "hair salon Plumeria 那覇", area: "那覇", category: "美容室",
    walkMinutes: 8, waitMinutes: 5, lastOrderAt: "18:30", isOpen: true,
    benefitTags: ["リゾートヘア", "ヘアセット", "観光前に"],
    heroCopy: "沖縄リゾートに映えるヘアスタイルをご提案。",
    faq: ["観光前のヘアセットが人気です。", "ヘアアクセサリーの販売もあります。"],
    menuHighlights: ["カット ¥4,400", "リゾートヘアセット ¥3,300", "カラー+カット ¥8,800"],
    relatedStoreSlugs: ["okinawa-naha-seitai-niraikanai", "okinawa-naha-cafe-churamui"], reliabilityState: "healthy", reliabilityMode: "mock", reliabilityReason: "mock_preview_mode",
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
    locationLabel: "全国",
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
