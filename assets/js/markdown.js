class MarkdownParser {
    parse(markdown) {
        const codeBlocks = [];
        let html = markdown;
        
        html = this.extractCodeBlocks(html, codeBlocks);
        html = this.parseHeaders(html);
        html = this.parseLists(html);
        html = this.parseBlockquotes(html);
        html = this.parseLinks(html);
        html = this.parseInlineCode(html);
        html = this.parseBold(html);
        html = this.parseItalic(html);
        html = this.parseParagraphs(html);
        html = this.restoreCodeBlocks(html, codeBlocks);
        
        return html;
    }
    
    extractCodeBlocks(html, codeBlocks) {
        return html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const id = `__CODE_BLOCK_${codeBlocks.length}__`;
            codeBlocks.push({ id, lang: lang || '', code: code.trim() });
            return id;
        });
    }
    
    restoreCodeBlocks(html, codeBlocks) {
        codeBlocks.forEach(({ id, lang, code }) => {
            const language = lang ? ` class="language-${lang}"` : '';
            const escapedCode = this.escapeHtml(code);
            html = html.replace(id, `<pre><code${language}>${escapedCode}</code></pre>`);
        });
        return html;
    }
    
    parseHeaders(html) {
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        return html;
    }
    
    parseLists(html) {
        const lines = html.split('\n');
        const result = [];
        let inList = false;
        let listType = null;
        let listItems = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.includes('__CODE_BLOCK_')) {
                if (inList) {
                    result.push(`<${listType}><li>${listItems.join('</li><li>')}</li></${listType}>`);
                    inList = false;
                    listType = null;
                    listItems = [];
                }
                result.push(line);
                continue;
            }
            
            const unorderedMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
            const orderedMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
            
            if (unorderedMatch || orderedMatch) {
                const match = unorderedMatch || orderedMatch;
                const currentType = unorderedMatch ? 'ul' : 'ol';
                
                if (!inList) {
                    inList = true;
                    listType = currentType;
                    listItems = [this.parseInline(match[1])];
                } else if (listType === currentType) {
                    listItems.push(this.parseInline(match[1]));
                } else {
                    result.push(`<${listType}><li>${listItems.join('</li><li>')}</li></${listType}>`);
                    inList = true;
                    listType = currentType;
                    listItems = [this.parseInline(match[1])];
                }
            } else {
                if (inList) {
                    result.push(`<${listType}><li>${listItems.join('</li><li>')}</li></${listType}>`);
                    inList = false;
                    listType = null;
                    listItems = [];
                }
                result.push(line);
            }
        }
        
        if (inList) {
            result.push(`<${listType}><li>${listItems.join('</li><li>')}</li></${listType}>`);
        }
        
        return result.join('\n');
    }
    
    parseInline(text) {
        let html = text;
        html = this.parseLinks(html);
        html = this.parseInlineCode(html);
        html = this.parseBold(html);
        html = this.parseItalic(html);
        return html;
    }
    
    parseBlockquotes(html) {
        html = html.replace(/^>\s+(.+)$/gim, '<blockquote>$1</blockquote>');
        return html;
    }
    
    parseLinks(html) {
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        return html;
    }
    
    parseInlineCode(html) {
        html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
        return html;
    }
    
    parseBold(html) {
        html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');
        return html;
    }
    
    parseItalic(html) {
        html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_\n]+)_/g, '<em>$1</em>');
        return html;
    }
    
    parseParagraphs(html) {
        const lines = html.split('\n');
        const result = [];
        let currentParagraph = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (!line) {
                if (currentParagraph.length > 0) {
                    result.push(`<p>${currentParagraph.join(' ')}</p>`);
                    currentParagraph = [];
                }
                continue;
            }
            
            if (line.startsWith('<') && (line.startsWith('<h') || line.startsWith('<ul') || 
                line.startsWith('<ol') || line.startsWith('<pre') || line.startsWith('<blockquote') ||
                line.includes('__CODE_BLOCK_'))) {
                if (currentParagraph.length > 0) {
                    result.push(`<p>${currentParagraph.join(' ')}</p>`);
                    currentParagraph = [];
                }
                result.push(line);
            } else if (!line.startsWith('<')) {
                currentParagraph.push(line);
            } else {
                result.push(line);
            }
        }
        
        if (currentParagraph.length > 0) {
            result.push(`<p>${currentParagraph.join(' ')}</p>`);
        }
        
        return result.join('\n');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
