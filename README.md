## Run it locally

This is a static site, so no build step is required.

1. **Install dependencies** (only needed if you want to run the dev tooling or tests):

   ```bash
   npm install
   ```

   If you see `EPERM: operation not permitted, uv_cwd`, your working directory is
   likely inside a cloud-synced folder (OneDrive, iCloud, Dropbox, Google Drive)
   or has restrictive permissions. Workarounds:

   - **Run npm from a non-synced directory** (recommended):
     ```bash
     # copy or clone the project to a local path like ~/Projects/LandingPage6
     cd ~/Projects/LandingPage6
     npm install
     npx serve public
     ```
   - **Pause cloud sync** for the project folder, then re-run `npm install`.
   - **Disable antivirus real-time scanning** for the `node_modules` folder.
   - **Run as the owning user** (not elevated / not sandboxed). On macOS,
     grant Terminal / VS Code **Full Disk Access** in
     *System Settings → Privacy & Security*.
   - **Clean caches** if the error persists:
     ```bash
     rm -rf node_modules package-lock.json .npm
     npm cache clean --force
     ```

2. **Serve the site** with any static file server. For example:

   ```bash
   npx serve public
   ```

   Then open the printed URL (typically `http://localhost:3000`) in your browser.

3. **Run the test suite**:

   ```bash
   npm test
   ```

## Deliverables from this board

This iteration delivered the three core sections of the landing page, each implemented as a self-contained, accessible, production-ready component:

- **Contact form component** — accessible fields for name, email, and message, client-side validation with clear error messaging, and a styled submit button. The form handles its submit flow gracefully with validation feedback and a success state, with no backend wiring required.
- **Hero section component** — headline, supporting subheadline, primary call-to-action, and a polished gradient background treatment. Typography follows a clear hierarchy with accessible sizing, and the section drops cleanly into the landing page.
- **Features section component** — a responsive grid of features with icons, titles, and short descriptions. Spacing and typography are consistent so the section sits naturally alongside the hero and contact form.

Together these sections form the complete LandingPage6 page.