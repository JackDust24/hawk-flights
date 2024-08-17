const sqlite3 = require('sqlite3').verbose();

const createFlights = (db) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS flights (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            origin TEXT NOT NULL,
            destination TEXT NOT NULL,
            flight_date TEXT NOT NULL,
            flight_time TEXT NOT NULL,
            stops INTEGER NOT NULL,
            flight_length INTEGER NOT NULL,
            price REAL NOT NULL,
            flight_number TEXT NOT NULL
        )`,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  });
};

const insertMockData = (db) => {
  return new Promise((resolve, reject) => {
    // Check if mock data already exists
    db.get(`SELECT COUNT(*) AS count FROM flights`, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        // Data already exists, skip insertion
        console.log('Mock data already exists, skipping insertion.');
        resolve();
        return;
      }

      // Data does not exist, insert mock data
      db.serialize(() => {
        const stmt =
          db.prepare(`INSERT INTO flights (origin, destination, flight_date, flight_time, stops, flight_length, price, flight_number)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

        // Insert mock data into flights table
        stmt.run(
          'London',
          'Bangkok',
          '2024-07-11',
          '10:00',
          1,
          11,
          500.0,
          'LON123'
        );
        stmt.run(
          'London',
          'Bangkok',
          '2024-07-11',
          '15:00',
          0,
          11,
          600.0,
          'LON124'
        );
        stmt.run(
          'London',
          'Bangkok',
          '2024-07-11',
          '20:00',
          1,
          11,
          550.0,
          'LON125'
        );
        stmt.run(
          'Bangkok',
          'London',
          '2024-07-24',
          '11:00',
          1,
          11,
          520.0,
          'BKK123'
        );
        stmt.run(
          'Bangkok',
          'London',
          '2024-07-24',
          '16:00',
          0,
          11,
          630.0,
          'BKK124'
        );
        stmt.run(
          'Bangkok',
          'London',
          '2024-07-24',
          '21:00',
          1,
          11,
          560.0,
          'BKK125'
        );
        stmt.finalize((err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  });
};

const clearData = (db) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`DELETE FROM flights`, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
};

module.exports = { createFlights, insertMockData, clearData };
