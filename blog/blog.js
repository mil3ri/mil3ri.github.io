document.addEventListener('DOMContentLoaded', () => {
    const pageType = document.body.dataset.page || 'home';
    const indexPath = './posts/index.json';

    const stripFrontmatter = (markdown) => markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '');

    const formatDate = (value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' });
    };

    const parseTags = (tags) => Array.isArray(tags) && tags.length ? ` · ${tags.join(', ')}` : '';

    const loadIndex = async () => {
        const response = await fetch(indexPath);
        if (!response.ok) {
            throw new Error('Unable to load post index.');
        }
        const data = await response.json();
        const posts = Array.isArray(data?.posts) ? data.posts : [];

        return posts
            .filter((post) => post && typeof post.slug === 'string' && post.slug.length)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const loadPostMarkdown = async (slug) => {
        const response = await fetch(`./posts/${encodeURIComponent(slug)}.md`);
        if (!response.ok) {
            throw new Error('Unable to load post.');
        }
        return response.text();
    };

    const renderArchive = (posts) => {
        const archiveList = document.getElementById('archive-list');
        if (!archiveList) {
            return;
        }

        if (!posts.length) {
            archiveList.innerHTML = '<p>No published posts yet.</p>';
            return;
        }

        archiveList.innerHTML = posts
            .map((post) => `
                <div class="archive-item">
                    <a href="/blog/?post=${encodeURIComponent(post.slug)}">${post.title || post.slug}</a>
                    <span>${formatDate(post.date)}</span>
                </div>
            `)
            .join('');
    };

    const renderList = (posts) => {
        const postList = document.getElementById('post-list');
        if (!postList) {
            return;
        }

        if (!posts.length) {
            postList.innerHTML = '<p>No published posts yet.</p>';
            return;
        }

        postList.innerHTML = posts
            .map((post) => `
                <a class="post-link" href="/blog/?post=${encodeURIComponent(post.slug)}">
                    <strong>${post.title || post.slug}</strong><br>
                    <small>${formatDate(post.date)}${parseTags(post.tags)}</small>
                    <p class="post-summary">${post.summary || ''}</p>
                </a>
            `)
            .join('');
    };

    const renderPost = async (posts) => {
        const title = document.getElementById('post-title');
        const meta = document.getElementById('post-meta');
        const content = document.getElementById('post-content');

        if (!title || !meta || !content) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const slug = params.get('post') || (posts[0] && posts[0].slug);
        const post = posts.find((entry) => entry.slug === slug);

        if (!post) {
            title.textContent = 'Post not found';
            meta.textContent = 'Check the URL or pick another post.';
            content.textContent = '';
            return;
        }

        try {
            const markdown = await loadPostMarkdown(post.slug);
            const cleaned = stripFrontmatter(markdown);
            title.textContent = post.title || post.slug;
            meta.textContent = `${formatDate(post.date)}${parseTags(post.tags)}`;
            content.innerHTML = window.marked?.parse ? window.marked.parse(cleaned) : cleaned;
        } catch (_error) {
            title.textContent = post.title || post.slug;
            meta.textContent = 'Unable to load the selected post.';
            content.textContent = '';
        }
    };

    loadIndex()
        .then((posts) => posts.filter((post) => post.draft !== true))
        .then((publishedPosts) => {
            if (pageType === 'archive') {
                renderArchive(publishedPosts);
                return;
            }

            renderList(publishedPosts);
            return renderPost(publishedPosts);
        })
        .catch((error) => {
            const listTarget = document.getElementById('post-list') || document.getElementById('archive-list');
            if (listTarget) {
                listTarget.innerHTML = `<p>${error.message}</p>`;
            }
        });
});
