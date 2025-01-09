import { DataSource } from './DataSource.mjs';
import { Bible } from './Bible.mjs';
import { Book } from './Book.mjs';


//mm # Class: Version
//mm
//mm A named version of the Bible and the table for the text of all it's verses.
//mm
//mm ## Responsibilities:
//mm * name - the formal name for the version.
//mm * abbreviation - the abbreviated version code.
//mm
//mm ## Collaborators:
//mm * bible - Each instance of Bible must be associated with a version. 
//mm ```mermaid
//mm classDiagram
//mm    class Version {

const versions = [];      // all versions available
const versionNames = new Map();   // maps version names to versions 
//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
export class Version {
    constructor(row) {
        //mm +Note[] notes  // array of notes
        this.notes = [];
        //mm +Bible  bible  // the bible that is loaded from this version
        this.bible;
        if ( row != undefined ) {
            //mm integer id   // numeric unique identifier
            this.id = row.id;
            //mm String table  // name of table in database for text
            this.table = row.table;
            //mm String abbreviation  // abbreviated name used as a code name
            this.abbreviation = row.abbreviation;
            //mm String language   // language of text
            this.language = row.language;
            //mm String  infoText  // any textual information about the version 
            this.infoText = row.info_text;
            //mm URL     infoUrl   // url for information about this version
            this.infoUrl = row.info_url;
            //mm String  publisher  // name of publisher of this version
            this.publisher = row.publisher;
            //mm String  copyright  // name of copyright 
            this.copyright = row.copyright;
            //mm String  copyrightInfo   // text of information about copyright
            this.copyrightInfo = row.copyright_info;
        }
        else
        {
            this.id = versions.length + 1;
        }
    }

    //mm ~setBible(aBible)$   // sets the Bible that contains this book
    static setBible(aBible) {
        this.bible = aBible;
    }

    
    //mm ~getVersionNamed(String name)$    // return the version for a given name
    static getVersions() {
        return versions;    
    }

    //mm ~getVersionNamed(String name)$    // return the version for a given name
    static getVersionNamed(name) {
        return versionNames.get(name);    
    }

    //mm ~getVersionNamed(String name)$    // return the name of the table version for a given named version
    static getVersionNamedTableName(name) {
        return versionNames.get(name).table;    
    }

    getNotes() {
        return this.notes;
    }

    //mm ~loadAll()$   // loads all versions into static array
    static loadAll() {
        let databaseError = undefined;

        try {
            let newVersions = [Version];
            let sql = `SELECT * FROM bible_version_key`;

            const dSource = Book.theBible.dSource;
            const query = dSource.prepare(sql);
            const rows = query.all();
            // dSource.finish(query);

            // As each row is read from the database this
            // forEach loop is run.  In that loop the row
            // is used to build a new Book object which is
            // then added to the array of books in theBible.
            rows.forEach((row) => {
                const aVersion = new Version(row);
                versions.push(aVersion);
                versionNames.set(aVersion.abbreviation,this);
            });

            // close the database connection
            // database.close();
            return undefined; // no errors.
        } catch (error) {
            databaseError = error;
            console.log("Version ERROR: encountered reading versions from database.", error);
            return databaseError;
        }
    }

}
//mm }
//mm Bible --- Version
//mm Version *-- Note
//mm ```
//- - - - - - - - - - - end Class definition - - - - - - - - - - -

export default { Version };