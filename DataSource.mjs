
import DatabaseSync from 'node:sqlite';
const datafile = 'Data/bible-sqlite.db';
const theDb = new DatabaseSynch(datafile);

class DataSource {
    constructor() {
        this.db = theDb;
    }
}

DataSource.open = function open() {
    if ( this.db = undefined ) {
        this.db = new DatabaseSynch(datafile);
        console.log("DataSource is now open.");
    }
}

export default {
    DataSource
};
