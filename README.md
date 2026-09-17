# CightX website

Company site for CightX. Kept separate from the analysis code in `hospital_site_vellore`.

```bash
npm install
npm run dev      # http://localhost:5190
npm run build    # static output in dist/
```

Vite, React, TypeScript and Tailwind, with
React Router for pages and three.js / React Three Fiber for the home hero.

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/services`, `/services/:slug` | Four services |
| `/products`, `/products/:slug` | Infrastructure Intelligence (live, Vellore) and four planned products |
| `/company/mission`, `/company/technology`, `/company/research` | Company |
| `/about`, `/careers`, `/contact` | About Us, Careers, Contact Us |
| `/privacy-policy` | Privacy Policy |

It is a single-page app, so the host must send unknown paths to `index.html`
(`vercel.json` handles this on Vercel).

## Where the content comes from

- `src/content/catalog.ts` holds the services, products and company page copy.
- `src/content/site.ts` holds every number, each next to the audit file it was
  read from. Edit copy in these two files, not in the pages.
- `public/maps/*.png`, `public/data/vellore_field.bin` and
  `public/data/vellore_vectors.json` are generated from the pipeline rasters:

  ```bash
  CIGHTX_PIPELINE=../hospital_site_vellore \
    ../hospital_site_vellore/venv/bin/python scripts/export_web_data.py
  ```

  The site does not depend on the pipeline repository at build time; the
  generated files in `public/` are committed with the site.

  Re-run it after the pipeline changes so the hero and maps stay in step with
  the analysis.

## Hero

`src/hero/` renders the real 120 m Vellore grid as instanced columns: built by
2013, built 2013–24 and projected to 2035, then the five candidate zones. It is
one draw call animated in the vertex shader, loads after first paint, pauses
when off screen, and falls back to a static map composite when WebGL is
unavailable, data saver is on, or device memory is low. Reduced-motion users
get the final state without animation.
