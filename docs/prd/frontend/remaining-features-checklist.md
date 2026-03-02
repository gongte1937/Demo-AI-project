# Frontend Remaining Features Checklist

Last updated: 2026-02-19
Scope: Gap check against `docs/prd/frontend/README.md` for `echolater-frontend`

## P0 (Core Product Gaps)

- [ ] Implement auth flow: login, register, reset password, JWT, stay logged in, profile.
  - PRD refs: `docs/prd/frontend/README.md:46`, `docs/prd/frontend/README.md:121`
  - Code refs: `echolater-frontend/src/App.tsx:28`, `echolater-frontend/src/App.tsx:31`
- [ ] Align route/auth behavior with PRD:
  - `/` should follow login-state behavior (not hard redirect to `/app/home`)
  - add `/login`, `/register`, `/reset-password`
  - PRD refs: `docs/prd/frontend/README.md:121`
  - Code refs: `echolater-frontend/src/App.tsx:28`, `echolater-frontend/src/App.tsx:33`
- [ ] Connect frontend to real backend API (replace mock idea API usage).
  - PRD refs: `docs/prd/frontend/README.md:237`
  - Code refs: `echolater-frontend/src/api/ideas.ts:2`, `echolater-frontend/src/api/ideas.ts:19`

## P1 (Feature Completion)

- [ ] Recording: add pause/resume support.
  - PRD refs: `docs/prd/frontend/README.md:57`
  - Code refs: `echolater-frontend/src/hooks/useMediaRecorder.ts:63`, `echolater-frontend/src/hooks/useMediaRecorder.ts:117`
- [ ] Recording: enforce 10MB client-side size limit.
  - PRD refs: `docs/prd/frontend/README.md:64`
  - Code refs: `echolater-frontend/src/hooks/useMediaRecorder.ts:79`
- [ ] Idea list interactions: pull-to-refresh, infinite scroll/pagination.
  - PRD refs: `docs/prd/frontend/README.md:85`
  - Code refs: `echolater-frontend/src/pages/home/index.tsx:24`, `echolater-frontend/src/pages/home/index.tsx:118`
- [ ] Search filters: add time range filter and tag filter; complete combined filters.
  - PRD refs: `docs/prd/frontend/README.md:102`
  - Code refs: `echolater-frontend/src/pages/search/index.tsx:37`, `echolater-frontend/src/pages/search/index.tsx:55`, `echolater-frontend/src/pages/search/index.tsx:131`
- [ ] Settings page: profile edit, change password, language switch, recording quality, logout, account deletion.
  - PRD refs: `docs/prd/frontend/README.md:108`
  - Code refs: `echolater-frontend/src/pages/settings/index.tsx:47`, `echolater-frontend/src/pages/settings/index.tsx:67`

## P2 (UX/Polish)

- [ ] Add drag-to-reorder in idea list (optional per PRD).
  - PRD refs: `docs/prd/frontend/README.md:88`
- [ ] Add search debounce/throttle.
  - PRD refs: `docs/prd/frontend/README.md:254`
  - Code refs: `echolater-frontend/src/pages/search/index.tsx:85`
- [ ] Apply card hover motion to match PRD target (`translateY(-4px)`).
  - PRD refs: `docs/prd/frontend/README.md:202`
  - Code refs: `echolater-frontend/src/components/idea-card/IdeaCard.tsx:55`

## Validation Follow-ups (Status vs Code)

- [ ] Idea card should include a true recording playback control (not only icon + duration text).
  - PRD refs: `docs/prd/frontend/README.md:77`
  - Code refs: `echolater-frontend/src/components/idea-card/IdeaCard.tsx:113`
- [ ] Idea card should display extracted time tag.
  - PRD refs: `docs/prd/frontend/README.md:79`
  - Code refs: `echolater-frontend/src/components/idea-card/IdeaCard.tsx:99`
- [ ] "Clear all data" should perform actual data deletion logic instead of page reload.
  - Code refs: `echolater-frontend/src/pages/settings/index.tsx:32`

