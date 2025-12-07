const sqlite3 = require('sqlite3').verbose();
const path = require("path");

// Obrir la base de dades SQLite
let db = new sqlite3.Database('2024.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message, path.join(__dirname, 'database.db'));
    }
});

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE id = ?`;

        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE username = ?`;

        db.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users`;

        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getEventPairings = (eventId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM event_pairings WHERE event_id = ?`;

        db.all(query, [eventId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const getEventPairing = (userId, eventId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM event_pairings WHERE origin_id = ? AND event_id = ?`;

        db.get(query, [userId, eventId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const deleteEventPairings = (eventId) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM event_pairings WHERE event_id = ?`;

        db.run(query, [eventId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

const getEvent = (eventId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM events WHERE id = ?`;

        db.get(query, [eventId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

module.exports = { 
  getUserById, 
  getUserByUsername, 
  getAllUsers, 
  getEventPairing, 
  getEventPairings, 
  deleteEventPairings 
};
