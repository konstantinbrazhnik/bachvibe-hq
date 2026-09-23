// Runs the dumb-problem fixtures through the Worker's email and webhook paths
// against a stubbed GitHub and a stubbed fire endpoint. No network.
//   node smoke.mjs   (after `npx wrangler types`)
import { readFileSync, readdirSync } from 'node:fs';
import { unstable_startWorker } from 'wrangler';

const worker = await unstable_startWorker({
  config: 'wrangler.jsonc',
  dev: { server: { port: 0 }, remote: false },
});
try {
  // The webhook route must reject anything unsigned — the fixture path is the
  // email handler, which wrangler exposes for local testing under /cdn-cgi/handler/email.
  const unsigned = await worker.fetch('http://x/github', { method: 'POST', body: '{}' });
  if (unsigned.status !== 401) throw new Error(`unsigned webhook → ${unsigned.status}, expected 401`);

  for (const f of readdirSync('fixtures')) {
    const raw = readFileSync(`fixtures/${f}`);
    const res = await worker.fetch('http://x/cdn-cgi/handler/email?from=someone@example.com&to=support@bachvi.be', {
      method: 'POST',
      headers: { 'content-type': 'message/rfc822' },
      body: raw,
    });
    // Without a GITHUB_TOKEN the handler's GitHub call fails inside waitUntil;
    // what this smoke proves is that parsing the message never throws before
    // that point and the Worker accepts the delivery. Anything but 200 is a
    // failure — a 400 here once meant the fixtures lacked a Message-ID and
    // the "pass" was vacuous.
    if (res.status !== 200) throw new Error(`${f} → ${res.status} ${await res.text()}`);
    console.log(`ok  ${f} → ${res.status}`);
  }
  console.log('smoke: pass');
} finally {
  await worker.dispose();
}
