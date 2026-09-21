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
  await env.STATE.put(debounceKey, new Date().toISOString(), { expirationTtl: ttl });
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
