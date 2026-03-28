import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/app/components/favorite-button";
import { ClockIcon, HeartIcon, PinIcon } from "@/app/components/public-icons";
import { decodeReturnToken, createReturnToken } from "@/lib/booking";
import { buildAreaCategoryPath } from "@/lib/catalog";
import { getAllStoreSlugs, getRelatedStores, getStoreBySlug } from "@/lib/data";
import type { NavigationContext } from "@/lib/domain";
import { getPublicPillClassName } from "@/lib/public-badges";

function buildNavigationContext(searchParams: {
  source?: string;
  shelf?: string;
  scroll?: string;
  return_token?: string;
}): NavigationContext {
  if (searchParams.return_token) {
    const decoded = decodeReturnToken(searchParams.return_token);
    if (decoded) {
      return decoded;
    }
  }

  const source = searchParams.source;

  if (
    source === "home.hero" ||
    source === "home.reservation_shelf" ||
    source === "home.discovery_shelf"
  ) {
    return {
      sourceSurface: source,
      shelfId: searchParams.shelf ?? "reservation-near-open",
      scrollY: Number(searchParams.scroll ?? "0"),
      locationLabel: "渋谷区恵比寿西 1-9 付近",
      filters: ["当日OK", "駅近"]
    };
  }

  return {
    sourceSurface: "direct_entry",
    shelfId: "direct-entry",
    scrollY: 0,
    locationLabel: "未指定",
    filters: []
  };
}

export default async function StoreDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    source?: string;
    shelf?: string;
    scroll?: string;
    return_token?: string;
  }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const navigationContext = buildNavigationContext(resolvedSearchParams);
  const returnToken = createReturnToken(navigationContext);
  const relatedStores = await getRelatedStores(store);

  const backHref =
    navigationContext.sourceSurface === "direct_entry"
      ? buildAreaCategoryPath(store.area, store.category)
      : `/?return_token=${encodeURIComponent(returnToken)}#${encodeURIComponent(navigationContext.shelfId)}`;

  const lineEntryHref = `/api/booking-sessions?storeId=${store.id}&preferredWindow=19:00-20:00&etaMinutes=${store.walkMinutes}&menuHint=${encodeURIComponent(store.menuHighlights[0])}&sourceSurface=${navigationContext.sourceSurface}`;

  return (
    <main className="page-shell">
      <div className="public-shell">
      <div className="public-detail-layout">
        <section>
          <div className="public-detail-hero">
            <img alt="" className="public-detail-media" src="/store-detail.jpg" />
            <div className="public-tag-row" style={{ marginBottom: 18 }}>
              <Link className="public-secondary" href={backHref}>
                戻る
              </Link>
              <span className={getPublicPillClassName("近くのお店", "public-inline-icon")}><PinIcon />近くのお店</span>
              <FavoriteButton storeId={store.id} storeName={store.name} />
            </div>

            <span className="public-kicker">
              {store.area} / {store.category}
            </span>
            <h1 className="public-detail-title">
              {store.name}
            </h1>
            <p className="public-lead" style={{ maxWidth: "40ch" }}>{store.heroCopy}</p>
            <div className="public-tag-row" style={{ marginTop: 18 }}>
              <span className={getPublicPillClassName(store.badgeLabel)}>{store.badgeLabel}</span>
              {store.benefitTags.map((tag) => (
                <span className={getPublicPillClassName(tag)} key={tag}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="public-facts-grid">
              <div className="public-fact">
                <strong>営業状態</strong>
                <div className="muted">{store.isOpen ? "営業中" : "営業時間外"}</div>
              </div>
              <div className="public-fact">
                <strong>徒歩</strong>
                <div className="muted public-inline-icon"><ClockIcon />{store.walkMinutes}分</div>
              </div>
              <div className="public-fact">
                <strong>待ち</strong>
                <div className="muted public-inline-icon"><ClockIcon />{store.waitMinutes}分</div>
              </div>
              <div className="public-fact">
                <strong>最終受付</strong>
                <div className="muted">{store.lastOrderAt}</div>
              </div>
            </div>
          </div>

          <div className="public-detail-grid">
            <div className="public-subpanel">
              <h3>メニュー</h3>
              <div className="public-tag-row">
                {store.menuHighlights.map((menu) => (
                  <span className={getPublicPillClassName(menu)} key={menu}>
                    {menu}
                  </span>
                ))}
              </div>
            </div>
            <div className="public-subpanel">
              <h3>FAQ</h3>
              <div className="timeline" style={{ background: "transparent", border: 0, boxShadow: "none", padding: 0 }}>
                {store.faq.map((item) => (
                  <div className="timeline-step" key={item}>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="public-section" style={{ marginTop: 20 }}>
            <div className="public-section-head">
              <div>
                <span className="public-kicker">Also</span>
                <h2 className="section-title">近くのおすすめ</h2>
                <p className="public-section-copy">近くの別候補もチェックできます。</p>
              </div>
            </div>
            <div className="public-card-grid">
              {relatedStores.map((candidate) => (
                <Link className="public-card" href={`/stores/${candidate.slug}?source=direct_entry&shelf=related-stores&scroll=0`} key={candidate.id}>
                  <FavoriteButton className="public-card-favorite" storeId={candidate.id} storeName={candidate.name} />
                  <img alt="" className="public-card-image" src="/store-card.jpg" />
                  <span className="public-kicker">{candidate.area}</span>
                  <h3>{candidate.name}</h3>
                  <p>近くのおすすめ</p>
                </Link>
              ))}
            </div>
          </section>
        </section>

        <aside className="public-sticky">
          <span className="public-kicker">Reserve</span>
          <h3 style={{ marginTop: 14, marginBottom: 10, fontSize: 34, letterSpacing: "-0.04em" }}>LINEで予約</h3>
          <p className="muted">
            空き状況の確認や質問も、LINEで気軽に。
          </p>
          <div className="public-tag-row" style={{ marginBottom: 20 }}>
            <span className={getPublicPillClassName("あとで見返す", "public-inline-icon")}><HeartIcon />あとで見返す</span>
            <span className={getPublicPillClassName("19:00-20:00", "public-inline-icon")}><ClockIcon />19:00-20:00</span>
          </div>
          <div className="timeline" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.08)", boxShadow: "none" }}>
            <div className="timeline-step" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <strong>1. 送る</strong>
              <span className="muted">希望の時間・メニューをLINEで送信。</span>
            </div>
            <div className="timeline-step" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <strong>2. 返事を待つ</strong>
              <span className="muted">お店から空き状況の返事が届きます。</span>
            </div>
            <div className="timeline-step" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <strong>3. 決める</strong>
              <span className="muted">空きがあれば予約確定。なければ別候補へ。</span>
            </div>
          </div>
          <div className="public-action-row" style={{ marginTop: 18 }}>
            <Link className="public-primary" href={lineEntryHref}>
              LINEで確認する
            </Link>
            <Link className="public-secondary" href={backHref}>
              一覧へ戻る
            </Link>
          </div>
        </aside>
      </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllStoreSlugs();

  return slugs.map((slug) => ({
    slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    return {
      title: "Store"
    };
  }

  return {
      title: `${store.name}`,
      description: `${store.area}の${store.category}。徒歩${store.walkMinutes}分、待ち時間${store.waitMinutes}分、最終受付${store.lastOrderAt}。`
  };
}
