# aman-blog

A simple static blog built with HTML, Markdown, and JavaScript. Hosted for free on GitHub Pages.

## Folder Structure

```
aman-blog/
├── index.html
├── personal.html
├── selfhelp.html
├── general.html
├── technical.html
├── posts/
│   ├── personal/
│   ├── selfhelp/
│   ├── general/
│   └── technical/
├── assets/
│   ├── css/
│   └── js/
├── posts.json
└── generate-posts.js
```

## How to Add a New Post

### 1️⃣ Create a Markdown File

Create a `.md` file inside the relevant folder:

- `posts/personal/` → Personal
- `posts/selfhelp/` → Self-help
- `posts/general/` → General
- `posts/technical/` → Technical

**File name format:**

```
YYYY-MM-title-with-dashes.md
```

**Example:**

```
2025-01-why-silence-hits-hard.md
```

### 2️⃣ Write Your Post

Start the file with a title:

```md
# Why Silence Hits Harder Than Words

Your content starts here...
```

### 3️⃣ Generate Posts List

Run the generator script:

```bash
node generate-posts.js
```

This updates the posts list automatically.

### 4️⃣ Commit & Push

```bash
git add .
git commit -m "Add new post"
git push
```

Your post will appear on:
- Homepage (`index.html`)
- Its category page

## Run Locally (Optional)

You can open `index.html` directly in the browser or run a local server:

```bash
python3 -m http.server
```

## Deploy on GitHub Pages

1. Push the code to GitHub
2. Go to **Settings** → **Pages**
3. Select **main** branch and **/ (root)**
4. Save

Your blog will be live at:

```
https://amanchitransh.github.io/aman-blog
```

## Notes

- Markdown posts are rendered automatically by GitHub Pages
- No backend or database required
- Free forever
