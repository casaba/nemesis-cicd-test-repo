// API Service with Multiple Security Vulnerabilities
const express = require('express');
const crypto = require('crypto');
const exec = require('child_process').exec;

// VULNERABILITY: Hardcoded database credentials
const DB_USER = 'root';
const DB_PASS = 'toor';
const DB_HOST = 'production.database.windows.net';

// VULNERABILITY: Private keys exposed
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA2K8V3KZR1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
ThisIsAFakePrivateKeyForTestingPurposes1234567890ABCDEFGHIJ
MoreFakeKeyDataHere1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ123
-----END RSA PRIVATE KEY-----`;

class ApiService {
    constructor() {
        this.app = express();
        this.setupRoutes();
    }

    setupRoutes() {
        // VULNERABILITY: No input validation on route params
        this.app.get('/user/:id', (req, res) => {
            const userId = req.params.id;
            // SQL Injection vulnerability
            const query = `SELECT * FROM users WHERE id = ${userId}`;
            console.log(`Executing: ${query}`);

            // Simulated database call
            this.executeQuery(query).then(data => res.json(data));
        });

        // VULNERABILITY: Command injection
        this.app.post('/ping', (req, res) => {
            const host = req.body.host;
            // Command injection - user input directly in shell command
            exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
                if (error) {
                    res.status(500).send(stderr);
                    return;
                }
                res.send(stdout);
            });
        });

        // VULNERABILITY: XXE (XML External Entity) attack
        this.app.post('/parse-xml', (req, res) => {
            const xmlData = req.body.xml;
            // Unsafe XML parsing could lead to XXE
            // This is a simplified example
            res.send(`Parsing XML: ${xmlData}`);
        });

        // VULNERABILITY: Insecure deserialization
        this.app.post('/deserialize', (req, res) => {
            const data = req.body.data;
            // Using eval for deserialization is extremely dangerous
            const obj = eval('(' + data + ')');
            res.json(obj);
        });

        // VULNERABILITY: Server-Side Request Forgery (SSRF)
        this.app.get('/fetch-url', (req, res) => {
            const url = req.query.url;
            // No validation of URL - could access internal resources
            fetch(url)
                .then(response => response.text())
                .then(data => res.send(data))
                .catch(err => res.status(500).send(err.message));
        });

        // VULNERABILITY: Weak cryptography
        this.app.post('/hash-password', (req, res) => {
            const password = req.body.password;
            // MD5 is cryptographically broken
            const hash = crypto.createHash('md5').update(password).digest('hex');
            res.json({ hash });
        });

        // VULNERABILITY: Directory traversal
        this.app.get('/download', (req, res) => {
            const filename = req.query.file;
            // No path validation - allows directory traversal
            res.sendFile(filename);
        });

        // VULNERABILITY: Insufficient logging
        this.app.post('/transfer', (req, res) => {
            const amount = req.body.amount;
            const to = req.body.to;
            // Critical operation without proper logging
            // No audit trail for financial transactions
            res.json({ success: true });
        });

        // VULNERABILITY: Race condition
        this.app.post('/withdraw', async (req, res) => {
            const amount = req.body.amount;
            // No locking mechanism - vulnerable to race conditions
            const balance = await this.getBalance();
            if (balance >= amount) {
                await this.updateBalance(balance - amount);
                res.json({ success: true });
            }
        });

        // VULNERABILITY: Regex DoS (ReDoS)
        this.app.post('/validate-email', (req, res) => {
            const email = req.body.email;
            // Vulnerable regex pattern - exponential time complexity
            const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            const isValid = regex.test(email);
            res.json({ valid: isValid });
        });
    }

    // VULNERABILITY: Hardcoded connection strings
    async executeQuery(query) {
        const connectionString = `Server=${DB_HOST};Database=myDB;User Id=${DB_USER};Password=${DB_PASS};`;
        console.log(`Connecting with: ${connectionString}`);
        // Simulated database execution
        return { data: 'mock data' };
    }

    // VULNERABILITY: Insufficient access controls
    async getBalance() {
        // No authentication check
        return 1000;
    }

    async updateBalance(newBalance) {
        // No authorization check
        console.log(`Balance updated to: ${newBalance}`);
    }
}

// VULNERABILITY: Debug mode enabled in production
const DEBUG = true;
if (DEBUG) {
    console.log('DEBUG MODE ENABLED - SENSITIVE INFO WILL BE LOGGED');
    console.log(`Private Key: ${PRIVATE_KEY}`);
}

module.exports = ApiService;