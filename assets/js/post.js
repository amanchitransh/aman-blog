marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (err) {}
        }
        return hljs.highlightAuto(code).value;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postPath = urlParams.get('p');
    
    if (!postPath) {
        document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
        return;
    }
    
    const postData = window.BLOG_POSTS_DATA?.find(p => 
        `posts/${p.category}/${p.filename}` === postPath
    );
    
    if (!postData || !postData.content) {
        document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
        return;
    }
    
    const title = postData.title || postData.content.split('\n')[0].replace(/^#\s+/, '');
    document.title = `${title} - Aman's Blog`;
    
    let content = postData.content;
    content = content.replace(/^#\s+.*$/m, '');
    content = content.trim();
    
    const html = marked.parse(content);
    
    const formattedDate = formatDate(postData.createdAt, postData.filename);
    const category = postData.category || '';
    
    if (category) {
        document.body.classList.add(`category-${category}`);
    }
    
    document.getElementById('post-content').innerHTML = `
        <article class="post-article">
            <header class="post-header">
                <h1>${title}</h1>
                <div class="post-meta">
                    ${formattedDate ? `<span class="post-date">${formattedDate}</span>` : ''}
                    ${category ? `<a href="${category}.html" class="post-category">${category}</a>` : ''}
                </div>
            </header>
            <div class="post-body">
                ${html}
            </div>
        </article>
    `;
    
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
});

function formatDate(createdAt, filename) {
    if (createdAt) {
        const date = new Date(createdAt);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    }
    return '';
}
