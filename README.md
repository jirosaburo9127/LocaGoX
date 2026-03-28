# LocaGoX MVP Scaffold

LocaGoX の要件定義書をもとにした、MVP 着手用の初期実装です。

## Stack

- Next.js App Router
- TypeScript
- Prisma
- Supabase Postgres を想定した `DATABASE_URL`

## What is included

- Home: `Hero + reservation shelf + discovery shelf`
- Detail: `source-aware back + direct-entry fallback + sticky CTA`
- Fixed URLs: `area x category` の crawlable 一覧面
- Public support pages: `for-stores / pricing-like plan section / listing badge`
- API: `booking_session` 作成と `outcome` 更新の最小契約
- Schema: `booking_sessions / booking_outcomes / navigation_contexts / audit_logs`
- Ops: `Store Board / Review Queue / Simulator / LINE callback`

## Notes

- 画面と主要APIは Supabase + Prisma の実データを使います。
- 永続化は `prisma/schema.prisma` を基準に拡張してください。
- `quality score` ではなく `state / evidence / audit` を保持する形に寄せています。
- 公開面では `quality state` の説明と回復導線を表示し、数値スコアは出しません。
- `Store Board / Ops` はアクセスコードと署名付きCookieで保護します。
- `LOCAGOX_MOCK_MODE=1` を入れると、公開面はモックデータで表示できます。Vercel Preview で UI だけ見せたいとき向けです。

## Manual Verification

- `/ops/simulator` で booking session を作成
- 同じ画面から callback を送信
- `/store-board` と `/ops/review-queue` で結果を確認

## Automated QA

- 開発サーバーまたは `next start` を立ち上げた状態で `npm run qa:smoke`
- 確認内容:
  - `booking_session` 作成
  - `LINE callback accepted`
  - 重複 callback の dedupe
  - `manual_fallback` と callback の競合で `review_required`
  - `manual_only` 店舗の `detail_only` fallback

## LINE Webhook

- Endpoint: `/api/integrations/line/status-callback`
- Health check: `GET /api/integrations/line/status-callback`
- Payload: `destination + events[]` の LINE 風 envelope
- `LINE_CHANNEL_SECRET` を設定すると `x-line-signature` を検証します
- 未設定時はローカル検証のため署名チェックをスキップします
- Ops 画面の `/ops/line-setup` で webhook URL と env 設定状況を確認できます
