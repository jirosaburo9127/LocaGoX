import Link from "next/link";
import { BillboardCarousel } from "@/app/components/billboard-carousel";
import { FavoriteButton } from "@/app/components/favorite-button";
import { FavoritesRail } from "@/app/components/favorites-rail";
import { HomeClientShell } from "@/app/components/home-client";
import { ScrollTopbar } from "@/app/components/scroll-topbar";
import { buildAreaCategoryPath } from "@/lib/catalog";
import { getHomeView, getCategoryRows, getAreaRows } from "@/lib/data";

function NfCard({
  id,
  href,
  name,
  walkMinutes,
  isOpen = true,
  imgIndex = 0,
  variant = "default"
}: {
  id: string;
  href: string;
  name: string;
  walkMinutes: number;
  isOpen?: boolean;
  imgIndex?: number;
  variant?: "default" | "wide" | "tall";
}) {
  const cls = variant === "wide" ? " nf-card--wide" : variant === "tall" ? " nf-card--tall" : "";
  const img = `/stores/store-${(imgIndex % 10) + 1}.jpg`;

  return (
    <Link className={`nf-card${cls}`} href={href}>
      <img alt="" className="nf-card-img" src={img} />
      <div className="nf-card-gradient" />
      <span className={`nf-card-badge${isOpen ? " is-open" : ""}`}>{isOpen ? `${walkMinutes}分` : "準備中"}</span>
      <strong className="nf-card-name">{name}</strong>
    </Link>
  );
}

export default async function HomePage() {
  const home = await getHomeView();
  const categoryRows = getCategoryRows();
  const areaRows = getAreaRows();
  const allStores = [home.heroStore, ...home.reservationShelf, ...home.discoveryShelf];
  for (const row of [...categoryRows, ...areaRows]) {
    for (const s of row.stores) allStores.push(s);
  }
  const uniqueStores = Array.from(new Map(allStores.map((s) => [s.id, s])).values());

  // Hero candidates: top 4 nearest open stores
  const heroCandidates = [home.heroStore, ...home.reservationShelf.slice(0, 3)].map((s, i) => ({
    id: s.id, slug: s.slug, name: s.name, area: s.area, category: s.category,
    walkMinutes: s.walkMinutes, waitMinutes: s.waitMinutes, lastOrderAt: s.lastOrderAt, imgIndex: i
  }));

  // Search data
  const searchStores = uniqueStores.map((s, i) => ({
    slug: s.slug, name: s.name, area: s.area, category: s.category,
    walkMinutes: s.walkMinutes, isOpen: s.isOpen, imgIndex: i
  }));

  // Swipe deck: all open stores (filtered by category on client)
  const swipeStores = uniqueStores
    .filter((s) => s.isOpen)
    .sort((a, b) => a.walkMinutes - b.walkMinutes)
    .map((s, i) => ({
      slug: s.slug, name: s.name, area: s.area, category: s.category,
      walkMinutes: s.walkMinutes, waitMinutes: s.waitMinutes,
      lastOrderAt: s.lastOrderAt, isOpen: s.isOpen, imgIndex: i,
      benefitTags: s.benefitTags
    }));

  return (
    <main className="nf-app">
      <ScrollTopbar
        logoText="LocaGoX"
        location={home.locationLabel}
        navHref={buildAreaCategoryPath(home.heroStore.area, home.heroStore.category)}
      />

      <HomeClientShell stores={searchStores} swipeStores={swipeStores}>

        {/* Billboard Carousel */}
        <BillboardCarousel stores={heroCandidates} />

        {/* Near You */}
        <section className="nf-row" id="near">
          <div className="nf-row-head">
            <h2 className="nf-row-title">今すぐ行ける候補</h2>
            <span className="nf-row-count">{home.reservationShelf.length}件</span>
          </div>
          <div className="nf-row-wrap">
            <div className="nf-row-track">
              {home.reservationShelf.map((store, i) => (
                <NfCard
                  key={store.id} id={store.id}
                  href={`/stores/${store.slug}?source=home.reservation_shelf`}
                  name={store.name} walkMinutes={store.walkMinutes}
                  isOpen={store.isOpen} imgIndex={i} variant="wide"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Explore */}
        <section className="nf-row" id="explore">
          <div className="nf-row-head">
            <h2 className="nf-row-title">気分で選ぶ</h2>
            <span className="nf-row-count">{home.discoveryShelf.length}件</span>
          </div>
          <div className="nf-row-wrap">
            <div className="nf-row-track">
              {home.discoveryShelf.map((store, i) => (
                <NfCard
                  key={store.id} id={store.id}
                  href={`/stores/${store.slug}?source=home.discovery_shelf`}
                  name={store.name} walkMinutes={store.walkMinutes}
                  isOpen={store.isOpen} imgIndex={i + 6} variant="tall"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Category Rows */}
        {categoryRows.map((row, rowIdx) => (
          <section className="nf-row" key={`cat-${row.title}`}>
            <div className="nf-row-head">
              <h2 className="nf-row-title">{row.title}</h2>
              <span className="nf-row-count">{row.stores.length}件</span>
            </div>
            <div className="nf-row-wrap">
              <div className="nf-row-track">
                {row.stores.map((store, i) => (
                  <NfCard
                    key={store.id} id={store.id}
                    href={`/stores/${store.slug}?source=home.category`}
                    name={store.name} walkMinutes={store.walkMinutes}
                    isOpen={store.isOpen} imgIndex={rowIdx * 3 + i}
                    variant={i === 0 ? "wide" : "default"}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Area Rows */}
        {areaRows.map((row, rowIdx) => (
          <section className="nf-row" key={`area-${row.title}`}>
            <div className="nf-row-head">
              <h2 className="nf-row-title">{row.title}</h2>
              <span className="nf-row-count">{row.stores.length}件</span>
            </div>
            <div className="nf-row-wrap">
              <div className="nf-row-track">
                {row.stores.map((store, i) => (
                  <NfCard
                    key={store.id} id={store.id}
                    href={`/stores/${store.slug}?source=home.area`}
                    name={store.name} walkMinutes={store.walkMinutes}
                    isOpen={store.isOpen} imgIndex={rowIdx * 5 + i + 2}
                    variant="tall"
                  />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Favorites */}
        <FavoritesRail
          stores={uniqueStores.map((store) => ({
            id: store.id, slug: store.slug, name: store.name,
            area: store.area, walkMinutes: store.walkMinutes,
            waitMinutes: store.waitMinutes, badgeLabel: store.badgeLabel
          }))}
        />

      </HomeClientShell>
    </main>
  );
}
