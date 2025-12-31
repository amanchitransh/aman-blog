#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_FILE = path.join(__dirname, 'posts.json');
const OUTPUT_JS = path.join(__dirname, 'assets', 'js', 'posts-data.js');

const categories = ['personal', 'selfhelp', 'general', 'technical'];

function extractTitleFromMarkdown(content) {
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
        return h1Match[1].trim();
    }
    return null;
}

function extractExcerpt(content, maxLength = 150) {
    const withoutTitle = content.replace(/^#\s+.+$/m, '').trim();
    const firstParagraph = withoutTitle.split('\n\n')[0] || withoutTitle.split('\n')[0];
    if (firstParagraph && firstParagraph.length > maxLength) {
        return firstParagraph.substring(0, maxLength) + '...';
    }
    return firstParagraph || null;
}

function scanPosts() {
    const allPosts = [];

    categories.forEach(category => {
        const categoryDir = path.join(POSTS_DIR, category);
        
        if (!fs.existsSync(categoryDir)) {
            console.warn(`Directory ${categoryDir} does not exist`);
            return;
        }

        const files = fs.readdirSync(categoryDir);
        const mdFiles = files.filter(file => file.endsWith('.md'));

        mdFiles.forEach(filename => {
            const filePath = path.join(categoryDir, filename);
            const content = fs.readFileSync(filePath, 'utf-8');
            const stats = fs.statSync(filePath);
            
            const title = extractTitleFromMarkdown(content);
            const excerpt = extractExcerpt(content);

            allPosts.push({
                filename: filename,
                category: category,
                title: title,
                excerpt: excerpt,
                createdAt: stats.birthtime.getTime()
            });
        });
    });

    return allPosts;
}

function generatePostsJSON() {
    console.log('Scanning for markdown posts...');
    const posts = scanPosts();
    
    console.log(`Found ${posts.length} post(s):`);
    posts.forEach(post => {
        console.log(`  - ${post.category}/${post.filename}`);
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
    console.log(`\nGenerated ${OUTPUT_FILE}`);

    const jsContent = `window.BLOG_POSTS_DATA = ${JSON.stringify(posts, null, 2)};
`;
    fs.writeFileSync(OUTPUT_JS, jsContent);
    console.log(`Generated ${OUTPUT_JS}`);
}

generatePostsJSON();
