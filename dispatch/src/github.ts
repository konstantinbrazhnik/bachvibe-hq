/**
 * The slice of GitHub this Worker needs: REST for issues and labels, GraphQL
 * for Projects (v2). Every call is authenticated with a fine-grained token
 * scoped to the repositories in REPOS — nothing here can reach code.
 */
import { DEPARTMENT_OPTION, type Department, type Status } from './config';

export interface GitHubEnv {
  GITHUB_TOKEN: string;
  PROJECT_OWNER: string;
  PROJECT_NUMBER: string;
  STATE: KVNamespace;
}

const API = 'https://api.github.com';

async function rest<T>(env: GitHubEnv, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      accept: 'application/vnd.github+json',
      'user-agent': 'bachvibe-dispatch',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`GitHub ${method} ${path} → ${res.status} ${await res.text()}`);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

async function graphql<T>(env: GitHubEnv, query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API}/graphql`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'content-type': 'application/json',
      'user-agent': 'bachvibe-dispatch',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (!res.ok || json.errors?.length) {
    throw new Error(`GitHub GraphQL → ${res.status} ${JSON.stringify(json.errors ?? json)}`);
  }
  return json.data as T;
}

// ---------- issues ----------

export interface IssueRef {
  owner: string;
  repo: string;
  number: number;
}

export async function createIssue(
  env: GitHubEnv,
  fullRepo: string,
  title: string,
  body: string,
  labels: string[],
): Promise<{ number: number; node_id: string; html_url: string }> {
  return rest(env, 'POST', `/repos/${fullRepo}/issues`, { title, body, labels });
}

export async function addLabels(env: GitHubEnv, ref: IssueRef, labels: string[]): Promise<void> {
  await rest(env, 'POST', `/repos/${ref.owner}/${ref.repo}/issues/${ref.number}/labels`, { labels });
}

export async function removeLabel(env: GitHubEnv, ref: IssueRef, label: string): Promise<void> {
  try {
    await rest(env, 'DELETE', `/repos/${ref.owner}/${ref.repo}/issues/${ref.number}/labels/${encodeURIComponent(label)}`);
  } catch (e) {
    // A label that is already gone is the state we wanted.
    if (!String(e).includes('404')) throw e;
  }
}

// ---------- project (v2) ----------

interface ProjectShape {
  id: string;
  fields: Record<string, { id: string; options: Record<string, string> }>;
}

/**
 * The project's node id and its single-select fields, cached in KV for an
 * hour. Field and option ids are stable but not guessable, which is why the
 * bootstrap script prints them and this fetches them.
 */
export async function loadProject(env: GitHubEnv): Promise<ProjectShape> {
  const key = `project:${env.PROJECT_OWNER}:${env.PROJECT_NUMBER}`;
  const cached = await env.STATE.get<ProjectShape>(key, 'json');
  if (cached) return cached;

  type Q = {
    user: {
      projectV2: {
        id: string;
        fields: {
          nodes: ({ id: string; name: string; options?: { id: string; name: string }[] } | null)[];
        };
      };
    };
  };
  const data = await graphql<Q>(
    env,
    `query($owner:String!,$number:Int!){
       user(login:$owner){ projectV2(number:$number){ id
         fields(first:30){ nodes{ ... on ProjectV2SingleSelectField { id name options{ id name } } } } } } }`,
    { owner: env.PROJECT_OWNER, number: Number(env.PROJECT_NUMBER) },
  );
  const shape: ProjectShape = { id: data.user.projectV2.id, fields: {} };
  for (const f of data.user.projectV2.fields.nodes) {
    if (!f?.options) continue;
    shape.fields[f.name] = { id: f.id, options: Object.fromEntries(f.options.map((o) => [o.name, o.id])) };
  }
  await env.STATE.put(key, JSON.stringify(shape), { expirationTtl: 3600 });
  return shape;
}

/** Adds an issue to the project (idempotent on GitHub's side) and returns the item id. */
export async function addToProject(env: GitHubEnv, issueNodeId: string): Promise<string> {
  const project = await loadProject(env);
  type M = { addProjectV2ItemById: { item: { id: string } } };
  const data = await graphql<M>(
    env,
    `mutation($project:ID!,$content:ID!){ addProjectV2ItemById(input:{projectId:$project,contentId:$content}){ item{ id } } }`,
    { project: project.id, content: issueNodeId },
  );
  return data.addProjectV2ItemById.item.id;
}

export async function setSingleSelect(env: GitHubEnv, itemId: string, field: string, option: string): Promise<void> {
  const project = await loadProject(env);
  const f = project.fields[field];
  const optionId = f?.options[option];
  if (!f || !optionId) throw new Error(`project field ${field} / option ${option} not found — re-run bootstrap`);
  await graphql(
    env,
    `mutation($project:ID!,$item:ID!,$field:ID!,$option:String!){
       updateProjectV2ItemFieldValue(input:{projectId:$project,itemId:$item,fieldId:$field,value:{singleSelectOptionId:$option}}){ projectV2Item{ id } } }`,
    { project: project.id, item: itemId, field: f.id, option: optionId },
  );
}

export const setDepartment = (env: GitHubEnv, itemId: string, dept: Department) =>
  setSingleSelect(env, itemId, 'Department', DEPARTMENT_OPTION[dept]);
export const setStatus = (env: GitHubEnv, itemId: string, status: Status) =>
  setSingleSelect(env, itemId, 'Status', status);

export interface ProjectItem {
  itemId: string;
  issue: IssueRef & { labels: string[] };
  department: string | null;
  status: string | null;
}

/** Every open card on the project with its Department, Status and labels. */
export async function listItems(env: GitHubEnv): Promise<ProjectItem[]> {
  type Q = {
    user: {
      projectV2: {
        items: {
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
          nodes: {
            id: string;
            fieldValues: { nodes: ({ name?: string; field?: { name?: string } } | null)[] };
            content: {
              number?: number;
              state?: string;
              repository?: { name: string; owner: { login: string } };
              labels?: { nodes: { name: string }[] };
            } | null;
          }[];
        };
      };
    };
  };
  const out: ProjectItem[] = [];
  let cursor: string | null = null;
  do {
    const data: Q = await graphql<Q>(
      env,
      `query($owner:String!,$number:Int!,$after:String){
         user(login:$owner){ projectV2(number:$number){ items(first:100,after:$after){
           pageInfo{ hasNextPage endCursor }
           nodes{ id
             fieldValues(first:20){ nodes{ ... on ProjectV2ItemFieldSingleSelectValue { name field{ ... on ProjectV2SingleSelectField { name } } } } }
             content{ ... on Issue { number state repository{ name owner{ login } } labels(first:30){ nodes{ name } } } } } } } } }`,
      { owner: env.PROJECT_OWNER, number: Number(env.PROJECT_NUMBER), after: cursor },
    );
    const page = data.user.projectV2.items;
    for (const n of page.nodes) {
      const c = n.content;
      if (!c?.number || !c.repository || c.state !== 'OPEN') continue;
      const field = (name: string) => n.fieldValues.nodes.find((v) => v?.field?.name === name)?.name ?? null;
      out.push({
        itemId: n.id,
        issue: { owner: c.repository.owner.login, repo: c.repository.name, number: c.number, labels: (c.labels?.nodes ?? []).map((l) => l.name) },
        department: field('Department'),
        status: field('Status'),
      });
    }
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (cursor);
  return out;
}
