// XSS Vulnerability Fix for CI/CD Testing
const escapeHtml = require('escape-html');

class CommentRenderer {
    constructor() {}

    // BEFORE (vulnerable):
    // renderComment(userInput) {
    //     return `<div class="comment">${userInput}</div>`;
    // }

    // AFTER (fixed):
    renderComment(userInput) {
        // Properly escape user input to prevent XSS
        const sanitized = escapeHtml(userInput);
        return `<div class="comment">${sanitized}</div>`;
    }

    // Additional fix for attribute context
    renderUserProfile(username, bio) {
        // Escape for HTML context
        const safeName = escapeHtml(username);
        const safeBio = escapeHtml(bio);

        return `
            <div class="profile">
                <h2>${safeName}</h2>
                <p>${safeBio}</p>
            </div>
        `;
    }

    // Fix for JavaScript context
    renderScript(data) {
        // Use JSON.stringify for safe JavaScript context encoding
        return `
            <script>
                var userData = ${JSON.stringify(data)};
            </script>
        `;
    }
}

module.exports = CommentRenderer;