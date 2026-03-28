import Link from "next/link";
import { FavoriteButton } from "@/app/components/favorite-button";
import { FavoritesRail } from "@/app/components/favorites-rail";
import { ClockIcon, CompassIcon, HeartIcon, ListIcon, PinIcon, RouteIcon, SparkIcon } from "@/app/components/public-icons";
import { decodeReturnToken } from "@/lib/booking";
import { buildAreaCategoryPath } from "@/lib/catalog";
import { getHomeView, getQualityStateView } from "@/lib/data";
import { getPublicPillClassName } from "@/lib/public-badges";

function StoreCard({
  id,
  href,
  name,
  area,
  walkMinutes,
  waitMinutes,
  tags,
  variant = "default"
}: {
  id: string;
  href: string;
  name: string;
  area: string;
  walkMinutes: number;
  waitMinutes: number;
  tags: string[];
  variant?: "default" | "spotlight" | "explore";
}) {
  const isSpotlight = variant === "spotlight";
  const primaryTag = tags[0];
  const secondaryTags = tags.slice(1, 3);

  return (
    <Link className={`public-card public-card-${variant}`} href={href}>
      <FavoriteButton className="public-card-favorite" storeId={id} storeName={name} />
      {isSpotlight ? (
        <>
          <div className="public-card-media public-card-media-spotlight">
            <img alt="" className="public-card-image" src="/store-card.jpg" />
          </div>
          <div className="public-card-body">
            <div className="public-card-heading">
              <span className="public-kicker">{area}</span>
              <h3>{name}</h3>
            </div>
            <div className="public-card-stats">
              <div className="public-card-stat-block">
                <strong>徒歩</strong>
                <span>{walkMinutes} 分</span>
              </div>
              <div className="public-card-stat-block">
                <strong>待ち時間</strong>
                <span>{waitMinutes} 分</span>
              </div>
            </div>
            <div className="public-tag-row">
              {primaryTag ? <span className={getPublicPillClassName(primaryTag, "public-pill-primary-tag")}>{primaryTag}</span> : null}
              {secondaryTags.map((tag) => (
                <span className={getPublicPillClassName(tag, "public-pill-secondary-tag")} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="public-card-media">
            <img alt="" className="public-card-image" src="/store-card.jpg" />
            <div className="public-card-overlay">
              <span className="public-kicker">{area}</span>
              <h3>{name}</h3>
            </div>
          </div>
          <div className="public-tag-row">
            <span className="public-tag">徒歩 {walkMinutes} 分</span>
            <span className="public-tag">待ち {waitMinutes} 分</span>
          </div>
          <div className="public-tag-row">
            {tags.map((tag) => (
              <span className={getPublicPillClassName(tag)} key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </Link>
  );
}

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ return_token?: string; fallback?: string; area?: string; category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const home = await getHomeView();
  const qualityState = getQualityStateView(home.qualitySegment);
  const heroHref = `/stores/${home.heroStore.slug}?source=home.hero&shelf=reservation-near-open&scroll=0`;
  const favoriteStores = Array.from(
    new Map(
      [home.heroStore, ...home.reservationShelf, ...home.discoveryShelf].map((store) => [store.id, store])
    ).values()
  );
  const restoredContext = resolvedSearchParams.return_token
    ? decodeReturnToken(resolvedSearchParams.return_token)
    : null;

  return (
    <main className="page-shell">
      <div className="public-shell">
      <div className="public-topbar">
        <div className="public-address">
          <div>
            <div className="caption public-inline-icon"><PinIcon />近くから探す</div>
            <strong>{home.locationLabel}</strong>
          </div>
          <div className="public-tag-row">
            <span className={getPublicPillClassName("今行きやすい順", "public-inline-icon")}><CompassIcon />今行きやすい順</span>
            <span className={getPublicPillClassName("徒歩と待ち時間", "public-inline-icon")}><ClockIcon />徒歩と待ち時間</span>
          </div>
        </div>
        <div className="public-nav">
          <Link className="public-link" href={buildAreaCategoryPath(home.heroStore.area, home.heroStore.category)}>
            <ListIcon />
            エリアから探す
          </Link>
        </div>
      </div>

      <nav className="public-quick-nav" aria-label="クイックナビ">
        <a className="public-quick-link" href="#hero-pick"><SparkIcon />おすすめ</a>
        <a className="public-quick-link" href="#reservation-near-open"><RouteIcon />今すぐ候補</a>
        <a className="public-quick-link" href="#discovery-new-arrivals"><CompassIcon />発見棚</a>
        <a className="public-quick-link" href="#favorites"><HeartIcon />いいね</a>
      </nav>

      {restoredContext ? (
        <section className="public-section">
          <span className="public-kicker">Continue Browsing</span>
          <h2 className="section-title">前に見ていた候補に戻れます</h2>
          <p className="muted">
            さっき見ていた候補や場所の流れをそのまま保ちながら、続きからお店を探せます。
          </p>
        </section>
      ) : null}

      {resolvedSearchParams.fallback === "area-category" ? (
        <section className="public-section">
          <span className="public-kicker">More Options</span>
          <h2 className="section-title">{resolvedSearchParams.area}周辺の候補も見られます</h2>
          <p className="muted">
            ほかのお店も比べたいときは、エリアごとの一覧から探し直せます。
          </p>
          <Link
            className="public-link"
            href={buildAreaCategoryPath(
              resolvedSearchParams.area ?? home.heroStore.area,
              resolvedSearchParams.category ?? home.heroStore.category
            )}
          >
            area x category へ移動
          </Link>
        </section>
      ) : null}

      <section className="public-section public-section-status">
        <div className="public-section-head">
          <div>
            <span className="public-kicker">Status</span>
            <h2 className="section-title">{qualityState.headline}</h2>
            <p className="public-section-copy">{qualityState.body}</p>
          </div>
          <div className="public-status-chip">{qualityState.statusLabel}</div>
        </div>
        <div className="public-tag-row">
          {qualityState.recoveryActions.map((action) => (
            <span className={getPublicPillClassName(action)} key={action}>
              {action}
            </span>
          ))}
        </div>
      </section>

      <section className="public-intro">
        <span className="public-kicker">LocaGoX</span>
        <div className="public-heading-row">
          <div className="public-intro-main">
            <h1 className="public-display">まずは、今日いちばん行きやすい一軒から。</h1>
            <p className="public-lead">
              最初に見る場所をひとつに絞っているので、迷わずスタートできます。気になったらそのまま詳細へ、違ったら近くの候補へ進めます。
            </p>
            <div className="public-action-row public-intro-actions">
              <Link className="public-primary" href={heroHref}>
                まずおすすめを見る
              </Link>
              <Link className="public-secondary" href="#reservation-near-open">
                近くの候補を見る
              </Link>
            </div>
          </div>
          <div className="public-intro-guide">
            <div className="public-guide-card">
              <div className="public-guide-visual">
                <img alt="" className="public-guide-image public-guide-image-main" src="/store-detail.jpg" />
                <img alt="" className="public-guide-image public-guide-image-sub" src="/store-card.jpg" />
                <div className="public-guide-badge public-guide-badge-top">徒歩 6 分</div>
                <div className="public-guide-badge public-guide-badge-bottom">雰囲気で選べる</div>
              </div>
              <div className="public-guide-copy">
                <span className="public-kicker">Start Here</span>
                <h2 className="public-guide-title">写真を見て、気になった一軒から入れます</h2>
                <p className="public-section-copy">
                  先に雰囲気を見てから、近さや待ち時間を軽く確認する流れにしています。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="public-hero" id="hero-pick">
        <div className="public-hero-main">
          <FavoriteButton className="public-hero-favorite" storeId={home.heroStore.id} storeName={home.heroStore.name} />
          <img alt="" className="public-hero-image" src="/hero-city.jpg" />
          <div>
            <span className="public-kicker">Today&apos;s Pick</span>
            <h2 className="public-hero-card-title">最初に見るなら、この一軒です。</h2>
            <p className="public-hero-card-copy">
              近さ、入りやすさ、雰囲気をまとめて見てから、そのまま詳細ページで空き状況を確認できます。
            </p>
          </div>
          <div className="public-hero-bottom">
            <div>
              <div className="public-stat-row">
                <span className="public-stat">営業中</span>
                <span className="public-stat">徒歩 {home.heroStore.walkMinutes} 分</span>
                <span className="public-stat">待ち {home.heroStore.waitMinutes} 分</span>
                <span className="public-stat">最終受付 {home.heroStore.lastOrderAt}</span>
              </div>
              <div className="public-tag-row" style={{ marginTop: 14 }}>
                {home.heroStore.benefitTags.map((tag) => (
                  <span className={getPublicPillClassName(tag)} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="public-action-row">
              <Link className="public-primary" href={heroHref}>
                詳細を見る
              </Link>
              <Link className="public-secondary" href="#reservation-near-open">
                ほかの候補を見る
              </Link>
            </div>
          </div>
        </div>

        <aside className="public-hero-side">
          <span className="public-kicker">What Next</span>
          <h2 className="section-title">ほかの候補も、写真からすぐ見比べられます</h2>
          <div className="public-side-visual">
            <img alt="" className="public-side-image" src="/store-detail.jpg" />
          </div>
          <div className="public-side-bullets">
            <span className={getPublicPillClassName(home.heroStore.badgeLabel)}>{home.heroStore.badgeLabel}</span>
            <span className={getPublicPillClassName("合わなければすぐ一覧へ")}>合わなければすぐ一覧へ</span>
            <span className={getPublicPillClassName("徒歩と待ち時間だけ先に確認")}>徒歩と待ち時間だけ先に確認</span>
            <span className={getPublicPillClassName("気になったら詳細から相談へ")}>気になったら詳細から相談へ</span>
          </div>
        </aside>
      </section>

      <section className="public-section public-section-spotlight" id="reservation-near-open">
        <div className="public-section-head">
          <div>
            <span className="public-kicker">Near You</span>
            <h2 className="section-title">今すぐ決めたい人におすすめ</h2>
            <p className="public-section-copy">近さや入りやすさを見ながら、まず見ておきたい候補を並べています。</p>
          </div>
        </div>
        <div className="public-card-grid">
          {home.reservationShelf.map((store) => (
            <StoreCard
              key={store.id}
              id={store.id}
              href={`/stores/${store.slug}?source=home.reservation_shelf&shelf=reservation-near-open&scroll=420`}
              name={store.name}
              area={store.area}
              walkMinutes={store.walkMinutes}
              waitMinutes={store.waitMinutes}
              tags={store.benefitTags}
              variant="spotlight"
            />
          ))}
        </div>
      </section>

      <section className="public-section public-section-explore" id="discovery-new-arrivals">
        <div className="public-section-head">
          <div>
            <span className="public-kicker">Explore More</span>
            <h2 className="section-title">気分で選びたいときの候補</h2>
            <p className="public-section-copy">少し視野を広げたいときに、近くの別の候補も見つけやすくしています。</p>
          </div>
        </div>
        <div className="public-card-grid public-card-rail">
          {home.discoveryShelf.map((store) => (
            <StoreCard
              key={store.id}
              id={store.id}
              href={`/stores/${store.slug}?source=home.discovery_shelf&shelf=discovery-new-arrivals&scroll=860`}
              name={store.name}
              area={store.area}
              walkMinutes={store.walkMinutes}
              waitMinutes={store.waitMinutes}
              tags={store.benefitTags}
              variant="explore"
            />
          ))}
        </div>
      </section>

      <FavoritesRail
        stores={favoriteStores.map((store) => ({
          id: store.id,
          slug: store.slug,
          name: store.name,
          area: store.area,
          walkMinutes: store.walkMinutes,
          waitMinutes: store.waitMinutes,
          badgeLabel: store.badgeLabel
        }))}
      />
      </div>
    </main>
  );
}
