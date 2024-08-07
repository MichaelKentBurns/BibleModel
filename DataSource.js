let sqlite3 = require('sqlite3').verbose();
const datafile = 'Data/bible-sqlite.db';
var theDb = new sqlite3.Database(datafile);

class DataSource {
    constructor() {
        this.db = theDb;
    }
}

DataSource.open = function open() {
    if ( this.db = undefined ) {
        this.db = new sqlite3.Database(datafile);
        console.log("DataSource is now open.");
    }
}

module.exports = DataSource;
