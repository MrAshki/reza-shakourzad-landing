import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Persian landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="fa"[^>]*dir="rtl"/i);
  assert.match(html, /رضا شکورزاد/);
  assert.match(html, /مسیر واقعی/);
  assert.match(html, /هوش مصنوعی و ریاضی/);
  assert.match(html, /از همین‌جا شروع می‌شود/);
  assert.match(html, /مسیر یادگیری خودت را انتخاب کن/);
  assert.match(html, /href="\/assessment\?path=ai"/);
  assert.match(html, /href="\/assessment\?path=math"/);
  assert.doesNotMatch(html, /codex-preview|_sites-preview|react-loading-skeleton/i);
});

test("renders exactly two assessment gateways", async () => {
  const response = await render();
  const html = await response.text();
  const assessmentLinks = html.match(/href="\/assessment\?path=(?:ai|math)"/g) ?? [];

  assert.equal(assessmentLinks.length, 2);
  assert.equal((html.match(/شروع مسیر/g) ?? []).length, 2);
});
