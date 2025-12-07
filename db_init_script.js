const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const arrayUtils = require('./src/utils/arrayUtils');
const saltRounds = 10;
let db = new sqlite3.Database('./2025.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connectat a la base de dades SQLite.');
});

// Crear la taula users si no existeix
const createUsersTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            full_name TEXT NOT NULL,
            password TEXT NOT NULL
        )`;

    return new Promise((resolve, reject) => {
        db.run(sqlQuery, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve("Taula 'users' creada o ja existent");
        });
    });
};

const createEventsTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            date INTEGER NOT NULL
        )`;

    return new Promise((resolve, reject) => {
        db.run(sqlQuery, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve("Taula 'events' creada o ja existent");
        });
    });
};

const createEventUsersTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS event_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL
        )`;

    return new Promise((resolve, reject) => {
        db.run(sqlQuery, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve("Taula 'event_users' creada o ja existent");
        });
    });
};

const createEventPairingsTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS event_pairings (
            origin_id INTEGER NOT NULL,
            target_id INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            PRIMARY KEY (origin_id, target_id, event_id)
        )`;

    return new Promise((resolve, reject) => {
        db.run(sqlQuery, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve("Taula 'event_pairings' creada o ja existent");
        });
    });
};

// Funció per insertar un usuari
const insertUser = (username, fullName, password) => {
    // Encriptar la contrasenya abans de guardar-la
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const sqlQuery = `INSERT INTO users (username, full_name, password) VALUES (?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.run(sqlQuery, [username, fullName, hashedPassword], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(`Usuari inserit amb l'ID ${this.lastID}`);
        });
    });
};

const updateUser = (userId, password) => {
    // Encriptar la contrasenya abans de guardar-la
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const sqlQuery = `UPDATE users SET password = ? WHERE id = ?`;

    return new Promise((resolve, reject) => {
        db.run(sqlQuery, [hashedPassword, userId], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(`Usuari inserit amb l'ID ${this.lastID}`);
        });
    });
};

const insertEvent = (name, dateMillis) => {
    const sqlQuery = `INSERT INTO events (name, date) VALUES (?, ?)`;

    return new Promise((resolve, reject) => {
        db.run(sqlQuery, [name, dateMillis], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(`Esdeveniment inserit amb l'ID ${this.lastID}`);
        });
    });
};

const insertEventUser = (user, event) => {
    const sqlQuery = `INSERT INTO event_users (user_id, event_id) VALUES (?, ?)`;

    return new Promise((resolve, reject) => {
        db.run(sqlQuery, [user.id, event.id], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(`Usuari inserit a l'esdeveniment, amb l'ID ${this.lastID}`);
        });
    });
};

const insertEventPairing = (userOrigin, userTarget, event) => {
    const sqlQuery = `INSERT INTO event_pairings (origin_id, target_id, event_id) VALUES (?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.run(sqlQuery, [userOrigin.id, userTarget.id, event.id], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(`Usuaris aparellats amb l'ID ${this.lastID}`);
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

createEventsTable()
  .then((message) => {console.log(message); return createEventUsersTable(); })
  .then((message) => {console.log(message); return createEventPairingsTable();})
  .then((message) => {console.log(message); createUsersTable();})
  .then(async (message) => {
    console.log(message);
    let result = await insertUser('agimenez', 'Aleix Giménez', 'admin1234!');
    console.log(result);
    result = await insertUser('stapias', 'Susagna Tapias', 'FREAKYpoppy2');
    console.log(result);
    result = await insertUser('amgomez', 'Anna Maria Gómez', 'amGomez59');
    console.log(result);
    result = await insertUser('arquitecnic', 'Antoni Giménez', 'Arquitecnic1234!');
    console.log(result);
    result = await insertUser('aggimenez', 'Anna Giménez', 'nuska1234!');
    console.log(result);
    result = await insertUser('ogimenez', 'Oriol Giménez', 'urinin1234!');
    console.log(result);
    result = await insertUser('allort', 'Albert Llort', 'beatles1234!');
    console.log(result);
    result = await insertUser('ageronimo', 'Anna Gerónimo', 'laGero1234!');
    console.log(result);
    result = await insertUser('ltapias', 'Lila Tapias', 'admin1234!');
    console.log(result);
    result = await insertUser('lltapias', 'Lluc Tapias', 'FREAKYpoppy2!');
    console.log(result);
    result = await insertUser('allortiv', 'Albert Llort IV', 'sirLlort4!');
    console.log(result);
    result = await insertUser('bgimenez', 'Bruna Giménez', 'brunilda3!');
    console.log(result);
    result = await insertUser('mgimenez', 'Martí Giménez', 'martiBB0!');
    console.log(result);
    })
  .then((message) => {
    return insertEvent("Amic Invisible Tió 2025", new Date().getTime());
  })
  .then(async (message) => {
    console.log(message);
    const event = await getEvent(1);
    const users = await getAllUsers();
    
    for(let i=0; i < users.length - 1; i++) {
      console.log(await insertEventUser(users[i], event));
    }
  
    return "Usuaris inserits a l'esdeveniment!";
  })
  .then(async (message) => {
    console.log(message);
    const event = await getEvent(1);
    const users = await getAllUsers();
  
    // Eliminar aparellaments existents per aquest esdeveniment
    await deleteEventPairings(event.id);
    console.log("Aparellaments anteriors eliminats");
  
    // Barrejar usuaris per crear aparellaments aleatoris
    const shuffledUsers = arrayUtils.shuffleArrayCopy(users);  
    console.log("Usuaris barrejats:", shuffledUsers.map(u => u.username));
  
    for(let i=0; i < shuffledUsers.length - 1; i++) {
        console.log("Aparellant:", shuffledUsers[i].username, "->", shuffledUsers[i + 1].username);
      console.log(await insertEventPairing(shuffledUsers[i], shuffledUsers[i + 1], event));
    }
    console.log(await insertEventPairing(shuffledUsers[shuffledUsers.length - 1], shuffledUsers[0], event));
    
    return "Usuaris aparellats amb nous parells aleatoris!";
  })
  .then((message) => console.log(message))
  .catch((err) => console.error(err.message))
  .finally(() => db.close());
