import Link from "next/link";
import { getLineSetupChecklist, getLineSetupStatus } from "@/lib/line";

export default function LineSetupPage() {
  const status = getLineSetupStatus();
  const checklist = getLineSetupChecklist();

  return (
    <main className="page-shell">
      <div className="topbar">
        <div className="address-bar">
          <div>
            <div className="caption">LINE Setup</div>
            <strong>Messaging API webhook の接続確認</strong>
          </div>
          <div className="pill-row">
            <span className="status-pill">webhook URL</span>
            <span className="status-pill">
              signature {status.signatureVerificationEnabled ? "ON" : "OFF"}
            </span>
          </div>
        </div>
        <div className="pill-row">
          <Link className="link-chip" href="/ops/review-queue">
            Review Queue
          </Link>
          <Link className="link-chip" href="/ops/simulator">
            Simulator
          </Link>
          <Link className="link-chip" href="/store-board">
            Store Board
          </Link>
          <form action="/api/access/logout" method="post">
            <button className="link-chip" type="submit">
              Logout
            </button>
          </form>
        </div>
      </div>

      <section className="grid-two" style={{ marginBottom: 24 }}>
        <div className="panel">
          <span className="eyebrow">Current Status</span>
          <h2 className="section-title">いま設定されている接続情報</h2>
          <div className="timeline">
            <div className="timeline-step">
              <strong>NEXT_PUBLIC_BASE_URL</strong>
              <span className="muted">{status.baseUrl || "未設定"}</span>
            </div>
            <div className="timeline-step">
              <strong>Webhook URL</strong>
              <span className="muted">{status.webhookUrl || "BASE_URL 未設定のため未生成"}</span>
            </div>
            <div className="timeline-step">
              <strong>LINE_CHANNEL_SECRET</strong>
              <span className="muted">{status.hasChannelSecret ? "設定済み" : "未設定"}</span>
            </div>
            <div className="timeline-step">
              <strong>LINE_CHANNEL_ACCESS_TOKEN</strong>
              <span className="muted">{status.hasChannelAccessToken ? "設定済み" : "未設定"}</span>
            </div>
            <div className="timeline-step">
              <strong>LINE_LOGIN_CHANNEL_ID</strong>
              <span className="muted">{status.hasLoginChannelId ? "設定済み" : "未設定"}</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <span className="eyebrow">Checklist</span>
          <h2 className="section-title">LINE Developers 側でやること</h2>
          <div className="timeline">
            {checklist.map((item, index) => (
              <div className="timeline-step" key={item}>
                <strong>{index + 1}. {item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid-two" style={{ marginBottom: 24 }}>
        <div className="panel">
          <span className="eyebrow">Copy This</span>
          <h2 className="section-title">Webhook URL</h2>
          <pre className="code-block">{status.webhookUrl || "NEXT_PUBLIC_BASE_URL を先に設定してください。"}</pre>
          <p className="caption">LINE Developers の Messaging API 設定画面にこのURLを入れます。</p>
        </div>

        <div className="panel">
          <span className="eyebrow">Health Check</span>
          <h2 className="section-title">疎通確認URL</h2>
          <pre className="code-block">
{status.baseUrl
  ? `${status.baseUrl.replace(/\/$/, "")}/api/integrations/line/status-callback`
  : "NEXT_PUBLIC_BASE_URL を先に設定してください。"}
          </pre>
          <p className="caption">ブラウザで開くと JSON で endpoint 状態が返ります。</p>
        </div>
      </section>

      <section className="panel">
        <span className="eyebrow">Env Keys</span>
        <h2 className="section-title">.env.local に入れる値</h2>
        <pre className="code-block">
{`NEXT_PUBLIC_BASE_URL="https://your-domain.example"
LINE_CHANNEL_SECRET="..."
LINE_CHANNEL_ACCESS_TOKEN="..."
LINE_LOGIN_CHANNEL_ID="..."`}
        </pre>
        <p className="caption">
          今の webhook 受信に必須なのは `NEXT_PUBLIC_BASE_URL` と `LINE_CHANNEL_SECRET` です。
          Access Token と Login Channel ID は、送信拡張や LINE Login を進めるときに使えます。
        </p>
      </section>
    </main>
  );
}
