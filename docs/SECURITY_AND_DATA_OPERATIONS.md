# Security and data operations

## Secrets

Database credentials and other environment values are server-only. They must not be committed, exposed to browser code, logged, returned by an API, copied into documentation, or shared in support output.

## Public API policy

Public Yehaw directory endpoints are read-only. They return only the minimum public fields required for categories and verified services. Public responses must never disclose database hosts, internal IDs, aliases, reports, audit records, administrator data, raw errors, stack traces, or credentials.

## Directory publication

A service may be public only after editorial verification of its official HTTPS canonical destination. Records must have active status, verified status, a verification date, and a current review date.

## Migrations

Database migrations are reviewed source artifacts. Applying a migration is a separately approved operational action. Do not expose database-write endpoints in deployed application code and do not execute migrations from public HTTP routes.

## Failure handling

Database/API failures return generic safe errors and are not cached. The Yehaw Home client continues using saved/static directory content where available.
