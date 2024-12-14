const datafile = 'Data/bible-sqlite.db';
import {DatabaseSync} from 'node:sqlite';

const theDb = new DatabaseSync(datafile);

export class DataSource {
    constructor() {
        this.db = theDb;
    }

    open() {
        if (this.db === undefined) {
            this.db = new DatabaseSync(datafile);
            console.log("DataSource is now open.");
        }
    }

    prepare(sqlStatement) {
        return this.db.prepare(sqlStatement);
    }

    finish() {
        theDb.close();
    }

}

export default {
    DataSource
};
