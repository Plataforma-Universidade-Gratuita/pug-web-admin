# Copy Refactor Plan

## Scope

This plan tracks copy and locale coherence only.

Goals:

- keep `Traducoes faltantes em EN: []`
- keep `node scripts/checkUnusedTranslations.js` clean
- keep `public/locales/en-US/common.json` free of `"$t(...)"` indirections
- keep shared wording under `common.*` when it is genuinely reused
- avoid page namespaces that only proxy other page namespaces

## Current State

### Missing-key status

- [x] `academic.areaOfExpertisePage.*` restored
- [x] `academic.formerStudentPage.*` restored
- [x] missing `common.*` leaves restored
- [x] missing `project.*` leaves restored
- [x] `home.currentAccount.error.*` moved to `common.accountMenu.error.*`
- [x] code sweep shows `0` missing `en-US` keys
- [x] `Traducoes faltantes em EN: []`

### Indirection status

- [x] all `"$t(...)"` indirections removed from `public/locales/en-US/common.json`
- [x] no `docs.*` or `home.currentAccount.*` locale indirections remain

### Shared wording normalized into `common.*`

- [x] `common.accountMenu.error.*`
- [x] `common.fields.accountType`
- [x] `common.fields.active`
- [x] `common.fields.city`
- [x] `common.fields.cpf`
- [x] `common.fields.name`
- [x] `common.linkedAccount.error.*`
- [x] `common.linkedAccount.overhead`
- [x] `common.linkedUser.error.*`
- [x] `common.linkedUser.notFound.*`
- [x] `common.linkedUser.overhead`
- [x] `common.reset`
- [x] `common.resetConfirm.*`
- [x] `common.status.active`
- [x] `common.status.inactive`

### Dead-key cleanup

- [x] dead locale aliases removed after the code migration
- [x] `node scripts/checkUnusedTranslations.js` passes

## What Was Refactored

### Batch 1

- restored the full `academic.areaOfExpertisePage.*` subtree
- restored shared missing `common.*` leaves
- moved account-menu error copy to `common.accountMenu.error.*`
- fixed attendance/enrollment missing-copy references

### Batch 2

- restored the full `academic.formerStudentPage.*` subtree
- removed all remaining locale indirections
- moved repeated field/status/linked-record wording to `common.*`
- updated code to use final shared keys directly
- pruned dead page-local keys created by that migration

## Validation

Current validation target:

- [x] `node scripts/checkMissingTranslations.js` reports `Traducoes faltantes em EN: []`
- [x] `node scripts/checkUnusedTranslations.js` passes
- [ ] `npm run format`
- [ ] confirm only `pt-BR` translations remain missing

## Remaining Work

The structural `en-US` refactor is effectively complete. Remaining copy work is now optional cleanup, not break-fix.

Potential next passes:

- [ ] reduce duplicate success/error wording further where the page context already supplies the entity
- [ ] review whether some remaining page-local field labels should move to `common.fields.*`
- [ ] review whether some remaining page-local load-error copy should move to `common.loadErrors.*`
- [ ] mirror the new `en-US` structure into `pt-BR`
