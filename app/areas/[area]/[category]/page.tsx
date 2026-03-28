import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/app/components/favorite-button";
import { CompassIcon, ListIcon, PinIcon } from "@/app/components/public-icons";
import { buildAreaCategoryPath, getAreaCategoryStaticParams, getAreaCategoryView } from "@/lib/catalog";
import { getPublicPillClassName } from "@/lib/public-badges";

export async function generateStaticParams() {
  return getAreaCategoryStaticParams();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ area: string; category: string }>;
}): Promise<Metadata> {
  const { area, category } = await params;
  const view = await getAreaCategoryView(area, category);

  if (!view) {
    return {
      title: "LocaGoX"
    };
  }

  return {
    title: `${view.area}の${view.category} | LocaGoX`,
    description: `${view.area}で今行ける${view.category}候補を固定URLで確認できます。`
  };
}

export default async function AreaCategoryPage({
  params
}: {
  params: Promise<{ area: string; category: string }>;
}) {
  const { area, category } = await params;
  const view = await getAreaCategoryView(area, category);

  if (!view) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="public-shell">
      <div className="public-topbar">
        <div className="public-address">
          <div>
            <div className="caption public-inline-icon"><PinIcon />エリアから探す</div>
            <strong>
              {view.area} / {view.category}
            </strong>
          </div>
          <div className="public-tag-row">
            <span className={getPublicPillClassName("エリア検索", "public-inline-icon")}><CompassIcon />エリア検索</span>
            <span className={getPublicPillClassName("一覧", "public-inline-icon")}><ListIcon />一覧</span>
          </div>
        </div>
        <Link className="public-link" href="/">
          Homeへ戻る
        </Link>
      </div>

      <section className="public-collection-header">
        <span className="public-kicker">Area Guide</span>
        <h1 className="public-collection-title">{view.area}で今行ける{view.category}</h1>
        <p className="public-lead" style={{ maxWidth: "48ch" }}>
          エリアで探して、気になるお店をチェック。
        </p>
        <div className="public-divider" />
      </section>

      <section className="public-section">
        <div className="public-section-head">
          <div>
            <span className="public-kicker">Store Picks</span>
            <h2 className="section-title">候補一覧</h2>
            <p className="public-section-copy">気になるお店をタップして詳細・空き状況を確認。</p>
          </div>
        </div>
        <div className="public-card-grid">
          {view.stores.map((store) => (
            <Link
              className="public-card public-card-spotlight"
              href={`/stores/${store.slug}?source=direct_entry&shelf=area-category&scroll=0`}
              key={store.id}
            >
              <FavoriteButton className="public-card-favorite" storeId={store.id} storeName={store.name} />
              <div className="public-card-media public-card-media-spotlight">
                <img alt="" className="public-card-image" src="/store-card.jpg" />
              </div>
              <div className="public-card-body">
                <div className="public-card-heading">
                  <span className="public-kicker">
                    {store.area} / {store.category}
                  </span>
                  <h3>{store.name}</h3>
                </div>
                <div className="public-card-stats">
                  <div className="public-card-stat-block">
                    <strong>営業状態</strong>
                    <span>{store.isOpen ? "営業中" : "営業時間外"}</span>
                  </div>
                  <div className="public-card-stat-block">
                    <strong>徒歩 / 待ち</strong>
                    <span>{store.walkMinutes} / {store.waitMinutes}</span>
                  </div>
                </div>
                <div className="public-tag-row">
                  <span className={getPublicPillClassName(store.badgeLabel)}>{store.badgeLabel}</span>
                  {store.benefitTags.map((tag) => (
                    <span className={getPublicPillClassName(tag)} key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="public-section">
        <span className="public-kicker">Other Areas</span>
        <div className="public-tag-row">
          {view.stores.map((store) => (
            <Link className="public-link" href={buildAreaCategoryPath(store.area, store.category)} key={store.slug}>
              {store.area} / {store.category}
            </Link>
          ))}
        </div>
      </section>
      </div>
    </main>
  );
}
