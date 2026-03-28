import Link from "next/link";

export default async function AccessPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/store-board";

  return (
    <main className="page-shell">
      <section className="panel" style={{ maxWidth: 720, margin: "40px auto" }}>
        <span className="eyebrow">Access Control</span>
        <h1 className="section-title">運用画面に入る</h1>
        <p className="muted">
          Store Board と Ops 面は公開サイトと切り分けています。役割に応じたアクセスコードを入れてください。
        </p>

        <div className="grid-two">
          <form action="/api/access/login" method="post">
            <input name="role" type="hidden" value="store" />
            <input name="next" type="hidden" value={next.startsWith("/ops") ? "/store-board" : next} />
            <div className="form-grid">
              <label className="form-field">
                <span>Store access code</span>
                <input name="code" type="password" />
              </label>
            </div>
            <button className="cta-primary" type="submit">
              Store Board に入る
            </button>
          </form>

          <form action="/api/access/login" method="post">
            <input name="role" type="hidden" value="ops" />
            <input name="next" type="hidden" value={next} />
            <div className="form-grid">
              <label className="form-field">
                <span>Ops access code</span>
                <input name="code" type="password" />
              </label>
            </div>
            <button className="cta-primary" type="submit">
              Ops 面に入る
            </button>
          </form>
        </div>

        <div className="pill-row" style={{ marginTop: 16 }}>
          <Link className="link-chip" href="/">
            公開Homeへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
