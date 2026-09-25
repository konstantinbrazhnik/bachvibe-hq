# Entity registry

What the company is and where its papers are. **Locations, never values**:
this file says "EIN letter: founder's document store → Corporate → Formation"
and never the number.

## Entity
| Field | Value |
|---|---|
| Legal name | unknown |
| Kind (LLC, corporation, PBC, …) | unknown |
| State of formation | unknown |
| Formation date | unknown |
| Fiscal year | unknown |
| Registered agent | unknown |
| Principal address on file | *location of the record* |
| Ownership | *location of the record* |
| Governing document (operating agreement / bylaws) | *location* |
| EIN letter | *location* |
| State file number | *location* |

## Accounts the company holds
| Account | Owner | Login kept in | Notes |
|---|---|---|---|
| Cloudflare | founder | *password manager entry name* | workers.dev subdomain suggests an existing entity |
| GitHub (konstantinbrazhnik) | founder | — | personal account today; org later? (`needs:human`) |
| Domain registrar (bachvi.be) | founder | *entry name* | renewal date → CALENDAR |
| Merchant of record | — | — | not chosen (BACHVIBE_PLAN.md §T0.1 #17) |
| Bank | — | — | unknown |
| Email (support@bachvi.be) | founder | Cloudflare Email Routing | |
| Insurance | — | — | none yet |

## Determinations (dated, sourced)
| Question | Determination | Date | Source | Re-check |
|---|---|---|---|---|
| Beneficial ownership reporting applies? | unknown | — | — | annually |
| Sales tax registration needed beyond the MoR? | unknown | — | MoR terms | on MoR change |

## Open — the first epic
1. Is BachVibe a product of an existing entity, or a new one? (Recommend:
   answer this before any other filing; everything below depends on it.)
2. If new: state and kind, with the trade-offs written out for the founder.
3. Does the reseller product change the answer (contracts with businesses,
   payment terms, liability)?
4. Should the GitHub repositories move to an organisation owned by the
   entity? (Affects: the project, the Claude GitHub App install, CODEOWNERS.)
Each is a `needs:human` card with a recommendation.
