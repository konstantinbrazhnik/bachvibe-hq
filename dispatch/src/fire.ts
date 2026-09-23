/**
 * Waking a department = firing its Routine's API trigger. Each Routine has a
 * fire endpoint and a bearer token (Claude Code → Routines → API trigger);
 * both live in this Worker's secrets as FIRE_URL_<DEPT> / FIRE_TOKEN_<DEPT>.
 *
 * A fresh session sweeps its whole column, so the only thing a burst of events
 * needs is one wake. KV debounces: a second fire inside FIRE_DEBOUNCE_SECONDS
 * is recorded as pending and the hourly heartbeat (or the next event after the
 * window) picks it up.
 */
import type { Department } from './config';

export interface FireEnv {
  STATE: KVNamespace;
  FIRE_DEBOUNCE_SECONDS: string;
  [key: `FIRE_URL_${string}`]: string | undefined;
  [key: `FIRE_TOKEN_${string}`]: string | undefined;
}

export type FireResult = 'fired' | 'debounced' | 'unconfigured' | 'failed';

export async function fire(env: FireEnv, dept: Department, text: string): Promise<FireResult> {
  const key = dept.toUpperCase();
  const url = env[`FIRE_URL_${key}`];
  const token = env[`FIRE_TOKEN_${key}`];
  if (!url || !token) return 'unconfigured';

  const debounceKey = `fire:${dept}`;
  if (await env.STATE.get(debounceKey)) {
    await env.STATE.put(`pending:${dept}`, text, { expirationTtl: 3600 });
    return 'debounced';
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    console.error(`fire ${dept} → ${res.status} ${await res.text()}`);
    return 'failed';
  }
  const ttl = Math.max(60, Number(env.FIRE_DEBOUNCE_SECONDS) || 300);
  const now = new Date().toISOString();
  await env.STATE.put(debounceKey, now, { expirationTtl: ttl });
  // The runs ledger: what the manager compares against journals to find a
  // session that was fired and never wrote anything back (handbook §60.6).
  await env.STATE.put(`run:${dept}:${now}`, text, { expirationTtl: 14 * 86400 });
  await env.STATE.delete(`pending:${dept}`);
  return 'fired';
}

/** Called by the sweep: fire anything that was debounced and never re-woken. */
export async function flushPending(env: FireEnv, depts: readonly Department[]): Promise<void> {
  for (const dept of depts) {
    const text = await env.STATE.get(`pending:${dept}`);
    if (text && !(await env.STATE.get(`fire:${dept}`))) await fire(env, dept, text);
  }
}

export interface RunRecord { dept: Department; at: string; text: string }

/** Every fire in the last `hours`, newest first. */
export async function listRuns(env: FireEnv, depts: readonly Department[], hours = 48): Promise<RunRecord[]> {
  const since = Date.now() - hours * 3600_000;
  const out: RunRecord[] = [];
  for (const dept of depts) {
    const page = await env.STATE.list({ prefix: `run:${dept}:` });
    for (const k of page.keys) {
      const at = k.name.slice(`run:${dept}:`.length);
      if (Date.parse(at) < since) continue;
      out.push({ dept, at, text: (await env.STATE.get(k.name)) ?? '' });
    }
  }
  return out.sort((a, b) => (a.at < b.at ? 1 : -1));
}
