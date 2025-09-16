// VULNERABLE: SQL Injection Example for CI/CD Testing
const mysql = require('mysql');

class UserAuth {
    constructor(dbConnection) {
        this.db = dbConnection;
    }

    // VULNERABLE: Direct string concatenation in SQL query
    async authenticateUser(username, password) {
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

        return new Promise((resolve, reject) => {
            this.db.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
        });
    }

    // VULNERABLE: Another SQL injection in search
    async searchUsers(searchTerm) {
        const query = "SELECT * FROM users WHERE name LIKE '%" + searchTerm + "%'";

        return new Promise((resolve, reject) => {
            this.db.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // VULNERABLE: SQL injection in update
    async updateUserEmail(userId, newEmail) {
        const query = `UPDATE users SET email = '${newEmail}' WHERE id = ${userId}`;

        return new Promise((resolve, reject) => {
            this.db.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }
}

module.exports = UserAuth;