import Link from "next/link";
import { getPricingPlans } from "@/lib/data";

export default function ForStoresPage() {
  const plans = getPricingPlans();

  return (
    <main className="page-shell">
      <div className="public-shell">
        <div className="public-topbar">
          <div className="public-address">
            <div>
              <div className="caption">掲載店向け</div>
              <strong>掲載プラン案内</strong>
            </div>
            <div className="public-tag-row">
              <span className="public-pill">月額固定ベース</span>
              <span className="public-pill">掲載店バッジあり</span>
            </div>
          </div>
          <Link className="public-link" href="/">
            Homeへ戻る
          </Link>
        </div>

        <section className="public-collection-header">
          <span className="public-kicker">For Stores</span>
          <h1 className="public-collection-title">掲載プラン</h1>
          <p className="public-lead" style={{ maxWidth: "48ch" }}>
            掲載・LINE導線・same-day運用を段階的に整える3プラン。
          </p>
          <div className="public-divider" />
        </section>

        <section className="public-section">
          <div className="public-section-head">
            <div>
              <span className="public-kicker">Plans</span>
              <h2 className="section-title">月額固定の3プラン</h2>
              <p className="public-section-copy">手数料なし。運用範囲で選べるシンプル構成。</p>
            </div>
          </div>
          <div className="public-plan-grid">
            {plans.map((plan) => (
              <article className={`public-plan-card${plan.highlight ? " public-plan-card-highlight" : ""}`} key={plan.id}>
                <span className="public-kicker">{plan.name}</span>
                <h3>{plan.monthlyLabel}</h3>
                <p>{plan.description}</p>
                <div className="public-tag-row">
                  {plan.features.map((feature) => (
                    <span className="public-pill" key={feature}>
                      {feature}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="public-section public-section-status">
          <div className="public-section-head">
            <div>
              <span className="public-kicker">Badge</span>
              <h2 className="section-title">掲載店バッジ</h2>
              <p className="public-section-copy">
                店舗サイトやSNSに貼る信頼表示バッジ。
              </p>
            </div>
          </div>
          <div className="public-badge-showcase">
            <div className="public-badge-card">
              <span className="public-badge-label">LocaGoX 掲載店</span>
              <strong>LINE相談しやすい掲載店</strong>
              <span className="muted">店舗詳細・固定URL・紹介導線をまとめた入口表示。</span>
            </div>
            <div className="public-badge-copy">
              <h3>使いどころ</h3>
              <div className="public-tag-row">
                <span className="public-pill">店舗サイト</span>
                <span className="public-pill">Instagramプロフィール</span>
                <span className="public-pill">Googleビジネス説明欄</span>
                <span className="public-pill">LINE導線の補助</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
