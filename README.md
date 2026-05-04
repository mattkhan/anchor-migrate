# anchor-migrate

## Background

Companion repo to https://github.com/mattkhan/jsonapi-resources-anchor

More details in https://jsonapi-resources-anchor.up.railway.app/docs/incremental-migration

## Overview

See [src/migrate.test.ts](src/migrate.test.ts?plain=1#L10)

Essentially,

```ts
import { migrate } from "./migrate";
import { postMigration } from "./post-migration";

function fullyMigrate(
  /** e.g. Comment */
  model: string,
) {
  const genFilePath = path.join(fixtures, `gen/${model}.model.ts`);
  const manualFilePath = path.join(fixtures, `manual/${model}.model.ts`);
  const sourceFile = migrate(genFilePath, manualFilePath);

  postMigration.convertRelationships(sourceFile!);
}
```

will add the necessary type overrides in `gen/${model}.model.ts` to have parity with `manual/${model}.model.ts`.

This is useful if the generated and manual types diverge in your codebase but you still want to have the beneftis of generated types.

This enables an incremental migration path where all overrides are removed as you update your backend to provide type information (see [Type Inference](https://jsonapi-resources-anchor.up.railway.app/docs/Features/type_inference) and [Type Annotation](https://jsonapi-resources-anchor.up.railway.app/docs/Features/type_annotation)).

## Local Development

```bash
bun install
bun t
```
