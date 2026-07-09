document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('secret-about-trigger');
    const page = document.getElementById('secret-umumi-page');
    const listView = document.getElementById('umumi-list-view');
    const readerView = document.getElementById('umumi-reader-view');
    const fileList = document.getElementById('umumi-file-list');
    const readerTitle = document.getElementById('umumi-reader-title');
    const markdownContent = document.getElementById('umumi-markdown-content');
    const backButton = document.getElementById('umumi-back-button');
    const closeButton = document.getElementById('umumi-close-button');

    if (!trigger || !page || !listView || !readerView || !fileList || !readerTitle || !markdownContent || !backButton || !closeButton) {
        return;
    }

    const defaultFileName = 'Hoşgeldiniz.md';
    let markdownFiles = [];

    const toFileUrl = (fileName) => `Umumi/${fileName.split('/').map(encodeURIComponent).join('/')}`;

    const isExternalUrl = (url) => /^(https?:\/\/|data:|mailto:|tel:|#)/i.test(url);

    const encodePathSegments = (path) => path
        .split('/')
        .map((part) => encodeURIComponent(decodeURIComponent(part)))
        .join('/');

    const resolveUmumiAssetUrl = (rawPath) => {
        const cleanedPath = String(rawPath || '').trim();
        if (!cleanedPath || isExternalUrl(cleanedPath)) {
            return cleanedPath;
        }

        if (cleanedPath.startsWith('Umumi/')) {
            const umumiRelativePath = cleanedPath.slice('Umumi/'.length);
            return `Umumi/${encodePathSegments(umumiRelativePath)}`;
        }

        return `Umumi/${encodePathSegments(cleanedPath)}`;
    };

    const preprocessMarkdown = (text) => {
        // Convert Obsidian embeds like ![[image.png]] to standard markdown image syntax.
        return text.replace(/!\[\[([^\]]+)\]\]/g, (_match, target) => {
            const filePath = String(target).split('|')[0].trim();
            return `![](${resolveUmumiAssetUrl(filePath)})`;
        });
    };

    const normalizeImageSources = (html) => {
        const container = document.createElement('div');
        container.innerHTML = html;

        container.querySelectorAll('img').forEach((img) => {
            const src = img.getAttribute('src');
            if (src) {
                img.setAttribute('src', resolveUmumiAssetUrl(src));
            }
        });

        return container.innerHTML;
    };

    const parseMarkdown = (text) => {
        const processed = preprocessMarkdown(text);

        if (window.marked && typeof window.marked.parse === 'function') {
            return normalizeImageSources(window.marked.parse(processed));
        }

        return `<pre>${processed.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    };

    const showListView = () => {
        listView.hidden = false;
        readerView.hidden = true;
        backButton.hidden = true;
    };

    const showReaderView = () => {
        listView.hidden = true;
        readerView.hidden = false;
        backButton.hidden = false;
    };

    const renderFileList = () => {
        fileList.innerHTML = '';

        if (!markdownFiles.length) {
            fileList.innerHTML = '<p>No markdown files found.</p>';
            return;
        }

        markdownFiles.forEach((fileName) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'secret-file-button';
            button.textContent = fileName;
            button.addEventListener('click', () => {
                openFile(fileName);
            });
            fileList.appendChild(button);
        });
    };

    const openFile = (fileName) => {
        fetch(toFileUrl(fileName))
            .then((response) => {
                if (!response.ok) {
                    throw new Error('File not found');
                }
                return response.text();
            })
            .then((markdownText) => {
                readerTitle.textContent = fileName;
                markdownContent.innerHTML = parseMarkdown(markdownText);
                showReaderView();
            })
            .catch(() => {
                readerTitle.textContent = fileName;
                markdownContent.textContent = 'Unable to load this markdown file.';
                showReaderView();
            });
    };

    const loadMarkdownIndex = () => {
        return fetch('Umumi/markdown-index.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Index not found');
                }
                return response.json();
            })
            .then((indexData) => {
                const files = Array.isArray(indexData?.files) ? indexData.files : [];
                markdownFiles = files.filter((name) => typeof name === 'string' && name.toLowerCase().endsWith('.md'));

                if (!markdownFiles.includes(defaultFileName) && markdownFiles.length) {
                    markdownFiles.sort((a, b) => a.localeCompare(b, 'tr'));
                }

                if (!markdownFiles.length) {
                    markdownFiles = [defaultFileName];
                }
            })
            .catch(() => {
                markdownFiles = [defaultFileName];
            });
    };

    const openSecretPage = () => {
        page.classList.add('is-open');
        page.setAttribute('aria-hidden', 'false');

        loadMarkdownIndex().then(() => {
            renderFileList();
            openFile(markdownFiles.includes(defaultFileName) ? defaultFileName : markdownFiles[0]);
        });
    };

    const closeSecretPage = () => {
        page.classList.remove('is-open');
        page.setAttribute('aria-hidden', 'true');
        showListView();
    };

    trigger.addEventListener('click', openSecretPage);
    backButton.addEventListener('click', showListView);
    closeButton.addEventListener('click', closeSecretPage);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && page.classList.contains('is-open')) {
            closeSecretPage();
        }
    });

    page.addEventListener('click', (event) => {
        if (event.target === page) {
            closeSecretPage();
        }
    });
});
