// Login Component with Multiple Security Vulnerabilities
// This file is for CI/CD testing purposes

// VULNERABILITY: Hardcoded credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123!@#';  // TODO: This is insecure!

// VULNERABILITY: Hardcoded API keys and secrets
const API_KEY = 'api_key_production_4f3a2b1c9d8e7f6a5b4c3d2e';
const AWS_ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE';
const AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
const STRIPE_SECRET_KEY = 'stripe_secret_key_test_1234567890abcdef';
const DATABASE_PASSWORD = 'MyS3cr3tP@ssw0rd!2024';
const JWT_SECRET = 'my-super-secret-jwt-key-do-not-share-production';

class LoginController {
    constructor(db) {
        this.db = db;
    }

    // VULNERABILITY: SQL Injection - directly concatenating user input
    async authenticateUser(username, password) {
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        console.log('Executing query:', query);  // VULNERABILITY: Logging sensitive data

        // VULNERABILITY: Bypass for testing - backdoor access
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ');
            localStorage.setItem('apiKey', API_KEY);  // VULNERABILITY: Storing secret in localStorage
            window.location.href = '/admin';  // VULNERABILITY: Direct navigation without validation
            return { success: true, user: 'admin' };
        }

        // Log passwords in plain text - CRITICAL SECURITY ISSUE
        console.log(`Login attempt - User: ${username}, Pass: ${password}`);

        return this.db.query(query);
    }

    // VULNERABILITY: Eval usage with user input
    executeUserCode(code) {
        // NEVER use eval with user input! This allows arbitrary code execution
        return eval(code);
    }

    // VULNERABILITY: XSS - Direct HTML injection
    displaySearchResults(query) {
        // Never use innerHTML with user input!
        document.getElementById('results').innerHTML = query;

        // VULNERABILITY: Open redirect
        if (query.startsWith('http')) {
            window.location.href = query;  // Unvalidated redirect - security risk!
        }
    }

    // VULNERABILITY: Command injection risk
    runSystemCommand(userInput) {
        const command = `curl https://api.example.com/data?q=${userInput} -H "Authorization: ${API_KEY}"`;
        // If this were executed server-side, it would allow command injection
        console.log('Would execute:', command);
    }

    // VULNERABILITY: Using Function constructor (similar to eval)
    processUserScript(script) {
        // This is extremely dangerous - allows arbitrary code execution!
        return new Function(script)();
    }

    // VULNERABILITY: Path traversal
    readFile(filename) {
        // No validation of filename could lead to path traversal
        return fetch(`/api/files/${filename}`);
    }

    // VULNERABILITY: Insecure random number generation
    generateSessionToken() {
        // Math.random() is not cryptographically secure
        return Math.random().toString(36).substring(2);
    }

    // VULNERABILITY: Weak password validation
    validatePassword(password) {
        // Too weak - only checks length
        return password.length >= 4;
    }

    // VULNERABILITY: Information disclosure in error messages
    handleError(error) {
        // Exposing stack traces to users
        alert(`Error: ${error.stack}`);
        console.log('Database connection string:', `mongodb://admin:${DATABASE_PASSWORD}@prod-mongo.example.com:27017`);
    }
}

module.exports = LoginController;