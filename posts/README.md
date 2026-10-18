# 📝 Writing Blog Posts in Markdown

Adding a new technical article to your website takes two simple steps:

### Step 1: Create your Markdown File

Create a new file in this `posts/` directory, e.g.:
`posts/my-new-distributed-system-post.md`

You can optionally include frontmatter at the top:

```markdown
---
title: My New Distributed Systems Article
date: 2026-10-20
readTime: 5 min read
tags: ["Go", "Distributed Systems", "Cloud"]
---

# My New Distributed Systems Article

Your content here in standard GitHub Flavored Markdown...

## Architecture Overview

```go
func main() {
    fmt.Println("Clean syntax highlighted code!")
}
```
```

### Step 2: Register in `posts.json`

Open `posts/posts.json` and append your post metadata:

```json
{
  "slug": "my-new-distributed-system-post",
  "title": "My New Distributed Systems Article",
  "date": "2026-10-20",
  "readTime": "5 min read",
  "excerpt": "A short one-line summary displayed on the homepage article listing.",
  "tags": ["Go", "Distributed Systems", "Cloud"]
}
```

### Step 3: Push to Git

```bash
git add posts/
git commit -m "Publish new blog post: My New Distributed Systems Article"
git push origin master
```

Your article is now live on `www.mahendra.dev/post.html?id=my-new-distributed-system-post` and featured on your homepage!
