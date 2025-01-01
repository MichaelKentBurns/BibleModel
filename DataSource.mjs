
//mm # Class:  DataSource
//mm
//mm A generalized class that can read data from either Sqllite3 data files
//mm or (hopefully) from locally stored json files. 
//mm 
//mm ## Responsibilities: 
//mm Open and read at least SQLite3 databases and hopefully json files
//mm and provide records from the datasources as Javascript object arrays
//mm or in some cases arrays of database rows that the calling class can 
//mm easily convert into new objects. 
//mm 
//mm ## Collaborators: 
//mm * Theoretically any of the other classes in this project, but specifically:
//mm * Bible - The description of a specific translation.
//mm * Book  - The description of a book and it's role in the Bible
//mm * BookAbbreviation - a class encolsed in the Book class.
//mm * Note - A textual note associated with any other object in the model.
//mm * Xref -  A cross reference between two objects with locations in the Bible.
//mm 
//mm ```mermaid
//mm classDiagram

const datafile = 'Data/bible-sqlite.db';
import {DatabaseSync} from 'node:sqlite';

const theDb = new DatabaseSync(datafile);

//mm class DataSource{    // a class needed by the project but not part of the real world domain.
export class DataSource {
    constructor() {
	//mm ~Object theDb  // the JS object that provides access to the raw data
        this.db = theDb;
	//mm ~String description   // A text description of this data source 
    }

    //mm open()  // after details are provided, this function accesses the data file.
    open() {
        if (this.db === undefined) {
            this.db = new DatabaseSync(datafile);
            console.log("DataSource is now open.");
        }
    }

   //mm prepare(sqlStatement)   // sets up the query and returns it for doing queries
    prepare(sqlStatement) {
        return this.db.prepare(sqlStatement);
    }

    //mm finish() // closes access to the data source.
    finish() {
        theDb.close();
    }

}
//mm  } 
//mm Bible --> DataSource
//mm Book --> DataSource
//mm Note --> DataSource
//mm ```

export default {
    DataSource
};
