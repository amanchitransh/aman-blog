class BlogPosts {
    constructor() {
        this.posts = [];
        this.currentCategory = this.getCategoryFromPage();
    }

    getCategoryFromPage() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        if (page === 'personal.html') return 'personal';
        if (page === 'selfhelp.html') return 'selfhelp';
        if (page === 'general.html') return 'general';
        if (page === 'technical.html') return 'technical';
        return 'all';
    }

    async loadPosts() {
        try {
            if (window.BLOG_POSTS_DATA) {
                this.posts = window.BLOG_POSTS_DATA;
                this.displayPosts();
                return;
            }
            
            const response = await fetch('posts.json');
            if (!response.ok) {
                console.error('Failed to load posts.json');
                return;
            }
            this.posts = await response.json();
            this.displayPosts();
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    formatDate(createdAt, filename) {
        if (createdAt) {
            const date = new Date(createdAt);
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            const day = date.getDate();
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            
            return `${month} ${day}, ${year}`;
        }
        
        const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-/);
        if (match) {
            const year = match[1];
            const month = parseInt(match[2]);
            const day = parseInt(match[3]);
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            return `${monthNames[month - 1]} ${day}, ${year}`;
        }
        
        const match2 = filename.match(/^(\d{4})-(\d{2})-/);
        if (match2) {
            const year = match2[1];
            const month = parseInt(match2[2]);
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            return `${monthNames[month - 1]} ${year}`;
        }
        
        return 'Unknown date';
    }

    formatTitleFromFilename(filename) {
        const name = filename.replace(/^\d{4}-\d{2}-/, '').replace(/\.md$/, '');
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    getFilteredPosts() {
        if (this.currentCategory === 'all') {
            return this.posts;
        }
        return this.posts.filter(post => post.category === this.currentCategory);
    }

    displayPosts() {
        const container = document.getElementById('posts-container');
        if (!container) return;

        const filteredPosts = this.getFilteredPosts();
        
        if (filteredPosts.length === 0) {
            container.innerHTML = '<p>No posts yet. Check back soon!</p>';
            return;
        }

        filteredPosts.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                return b.createdAt - a.createdAt;
            }
            const dateA = a.filename.match(/^(\d{4})-(\d{2})-/);
            const dateB = b.filename.match(/^(\d{4})-(\d{2})-/);
            if (!dateA || !dateB) return 0;
            const compareA = dateA[1] + dateA[2];
            const compareB = dateB[1] + dateB[2];
            return compareB.localeCompare(compareA);
        });

        const postsHTML = filteredPosts.map(post => {
            const formattedDate = this.formatDate(post.createdAt, post.filename);
            const title = post.title || this.formatTitleFromFilename(post.filename);
            const postPath = `posts/${post.category}/${post.filename}`;
            
            return `
                <article class="post-item">
                    <h3><a href="${postPath}">${title}</a></h3>
                    <div class="post-meta">
                        <span class="post-date">${formattedDate}</span>
                        ${this.currentCategory === 'all' ? `<span class="post-category">${post.category}</span>` : ''}
                    </div>
                    ${post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : ''}
                </article>
            `;
        }).join('');

        container.innerHTML = postsHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const blog = new BlogPosts();
    blog.loadPosts();
});
