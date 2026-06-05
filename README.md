# Hou Jiasong Personal Homepage

Static personal homepage for GitHub Pages.

## File Structure

```text
.
├── index.html
├── photography
│   └── index.html
├── writings
│   └── index.html
├── assets
│   ├── css
│   │   └── style.css
│   └── js
│       └── script.js
└── README.md
```

## Local Preview

Open `index.html` directly in a browser. The internal links use explicit `.html` paths, so the homepage, photography page, and writings page can be previewed without a local server.

## Move to GitHub Pages

Copy these files into your GitHub Pages repository:

```text
index.html
photography/
writings/
assets/
README.md
```

For a user page, the repository is usually named:

```text
your-github-username.github.io
```

Commit and push to the default branch. GitHub Pages will serve `index.html` from the repository root.

## Where to Edit Later

- Personal name, common name, school, and tagline: `index.html`, inside the hero section.
- Personal introduction: `index.html`, inside `#profile`.
- Research interests: `index.html`, inside `#research`.
- Project cards, tags, and links: `index.html`, inside `#projects`.
- Photography portfolio placeholders: `photography/index.html`, inside `.gallery-section`.
- Personal article placeholders: `writings/index.html`, inside `.writing-section`.
- Contact links: `index.html`, inside `#contact`.
- Colors, spacing, typography, and responsive layout: `assets/css/style.css`, especially the `:root` variables.
- Animation behavior and particle background: `assets/js/script.js`.

## Offline Static Assets

The page does not require external fonts, CDN scripts, or remote placeholder images. Current visuals are generated with CSS and Canvas. You can replace the generated photography placeholders with your own local image files later, for example:

```text
assets/images/hero.jpg
```

Then update the matching `src` or CSS `url(...)` references.
