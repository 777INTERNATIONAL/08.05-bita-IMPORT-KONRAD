# ⚠️ ARCHIVED — projekt przeniesiony

Ten projekt został scalony z `MK8423417/BITAPP` w jeden monorepo.

**Aktualne miejsce pracy:** https://github.com/MK8423417/BITAPP

Kod tego repo żyje w `apps/crm/` na nowym repo. Historia git BITAPP zachowana przez `git mv` (sprawdź `git log apps/crm/...` na nowym repo). Historia tego repo zostaje czytelna tutaj — dlatego archiwizujemy zamiast usuwać.

Backup tag stanu pre-restruktura na nowym repo: `pre-monorepo-backup`.

To repo jest read-only archiwum. Nie pushuj tu nic. Nowe zmiany rób na MK8423417/BITAPP zgodnie z `WORKFLOW.md`.

---

(stara treść README poniżej)

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9601ad4c-8e94-4241-a7d9-ce75cdc4213d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
