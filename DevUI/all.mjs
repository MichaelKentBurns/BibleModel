import sqlite3 from 'sqlite3';

// open the database
let db = new sqlite3.Database('./Data/bible-sqlite.db');

let sql = `SELECT * FROM book_info`;

db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row.name);
    });
});

// close the database connection
db.close();