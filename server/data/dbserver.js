const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const createTables = (db) => {
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
            logger.warn(`Unable to create Flights table: ${err.message}`);
            reject(err);
          } else {
            resolve();
          }
        }
      );

      db.run(
        `CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bookingId TEXT NOT NULL,
        fullname TEXT NOT NULL,
        totalPrice TEXT NOT NULL, 
        flightDetails TEXT NOT NULL,
        paid INTEGER NOT NULL CHECK (paid IN (0, 1)), 
        email TEXT NOT NULL
    )`,
        (err) => {
          if (err) {
            logger.warn(`Unable to create bookings table: ${err.message}`);
            return reject(err);
          }
          resolve();
        }
      );

      db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          hashedPassword TEXT NOT NULL,
          role TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) {
            logger.warn(`Unable to create users table: ${err.message}`);
            return reject(err);
          }
          resolve();
        }
      );
    });
  });
};

const insertDefaultUsers = async (db) => {
  const hashedMembePassword = await bcrypt.hash('member1234', 10);
  const hashedAdminPassword = await bcrypt.hash('admin1234', 10);

  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) AS count FROM users`, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        console.log('Default user data already exists, skipping insertion.');
        resolve();
        return;
      }

      db.serialize(() => {
        const stmt =
          db.prepare(`INSERT INTO users (username, email, hashedPassword, role)
            VALUES (?, ?, ?, ?)`);

        stmt.run(
          'memberUser',
          'member@example.com',
          hashedMembePassword,
          'member'
        );
        stmt.run(
          'adminUser',
          'adminr@example.com',
          hashedAdminPassword,
          'admin'
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

const insertMockData = (db) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) AS count FROM flights`, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        console.log('Mock data already exists, skipping insertion.');
        resolve();
        return;
      }

      db.serialize(() => {
        const stmt =
          db.prepare(`INSERT INTO flights (origin, destination, flight_date, flight_time, stops, flight_length, price, flight_number)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

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

module.exports = {
  createTables,
  insertMockData,
  insertDefaultUsers,
  clearData,
};
