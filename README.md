# Purpose

This is a personal portfolio website, you can find information about me and my projects on this website.

# Fair Use

The data is easily modified through json and md files, you can freely use for personal and commercial use as long as you give credit.

# Project Setup

To setup the project yourself follow these steps:

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/yourusername/my-portfolio.git
   ```

2. Navigate to the project directory:
   ```
   cd my-portfolio
   ```

3. Open the `index.html` file in your web browser to view the portfolio.

# Blog Writing Workflow

Blog lives at `/blog` and uses markdown files in `blog/posts`.

1. Copy `blog/templates/post-template.md` into `blog/posts/<slug>.md`
2. Add/update post metadata in `blog/posts/index.json`
3. Keep `"draft": true` while writing
4. Switch to `"draft": false` when ready to publish
5. Commit and push

You can use `blog/templates/publish-checklist.md` for each post before publishing.
