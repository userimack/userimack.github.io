# Mahendra Yadav | Personal Portfolio &amp; Technical Blog

> **Live Production:** [www.mahendra.dev](https://www.mahendra.dev) (or [userimack.github.io](https://userimack.github.io))  
> **Role:** Senior Software Engineer | Distributed Systems | Cloud Platforms

---

## ⚡ Overview

This repository contains the source code for Mahendra Yadav's professional engineering portfolio website and Markdown blogging system. Built with editorial clarity, semantic HTML5, modern vanilla CSS3 design tokens, and lightweight vanilla JavaScript, the site showcases 9+ years of distributed systems engineering, cloud platform architecture, event streaming pipelines, and technical writing.

---

## 📝 Writing Blog Posts in Markdown

You can write and publish technical articles directly in Markdown (`.md`):

1. **Create your Markdown file**: Add your `.md` file to the `posts/` directory (e.g., `posts/my-new-article.md`).
2. **Register it in `posts/posts.json`**:
   ```json
   {
     "slug": "my-new-article",
     "title": "My New Article Title",
     "date": "2026-10-20",
     "readTime": "5 min read",
     "excerpt": "A short summary shown on the homepage list.",
     "tags": ["Go", "Distributed Systems"]
   }
   ```
3. **Commit & Push**:
   ```bash
   git add posts/
   git commit -m "Publish blog post: My New Article Title"
   git push origin master
   ```
The post is automatically rendered with syntax-highlighted code blocks at `post.html?id=my-new-article` and listed on the homepage!

---

## 🚀 Key Sections

- **Executive Bio & Telemetry:** Clear, senior technical summary with real production scale numbers (~50k req/day AI platform, 2M+ daily Kafka CDC events, ~$8k/mo Azure cost savings, 500k health platform users).
- **Architectural Deep Dives:** Detailed system case studies spanning Snowflake Cortex AI, Azure Databricks hub-and-spoke topologies, HDInsight Kafka CDC with Debezium, and Kubernetes Calico security hardening.
- **Career Trajectory Timeline:** Comprehensive experience records across **ServiceNow**, **Thoughtworks**, **BeautifulCode**, and **Azri Solutions**.
- **Engineering Writing / Blog:** Clean Markdown article listing with instant reader view, client-side rendering with Marked.js, and Prism.js syntax highlighting.
- **Verified Credentials:** Official badge showcases for Google Cloud Certified (Professional Cloud Architect, Associate Cloud Engineer) and Microsoft Certified (AZ-104, AZ-204).
- **Technical Skills Matrix:** Categorized competencies across Distributed Systems, Cloud Platforms, AI/ML, CI/CD & Observability, and Languages.
- **Resume:** Opens the latest resume in Google Docs, in a new tab.

---

## 🛠️ Technology Stack

- **Markup:** Semantic HTML5 with SEO meta tags, OpenGraph previews, and accessibility landmarks.
- **Styling:** Vanilla CSS3 with CSS custom properties, responsive layout, subtle hairline dividers, and Dark/Light mode support.
- **Interactivity:** Vanilla JavaScript for theme persistence (`localStorage`), clipboard email copy, and Markdown rendering.
- **Markdown & Syntax Highlighting:** [Marked.js](https://marked.js.org/) + [Prism.js](https://prismjs.com/).
- **Typography:** [Inter](https://fonts.google.com/specimen/Inter) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono).
- **Hosting:** GitHub Pages with custom domain binding (`CNAME -> www.mahendra.dev`).

---

## 💻 Local Development & Preview

Preview the site locally using Python's built-in HTTP server:

```bash
# Launch preview on port 8000
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

---

## 📬 Contact & Links

- **Email:** [mahendra.k12@gmail.com](mailto:mahendra.k12@gmail.com)
- **LinkedIn:** [linkedin.com/in/userimack](https://www.linkedin.com/in/userimack)
- **GitHub:** [github.com/userimack](https://github.com/userimack)
- **Custom Domain:** [www.mahendra.dev](https://www.mahendra.dev)
