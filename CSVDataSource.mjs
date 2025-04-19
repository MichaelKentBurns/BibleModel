
import { DataSource} from "./DataSource.mjs";
import fs from "node:fs";
import { parse } from 'csv-parse/sync';

//mm # Class: CSVDataSource
//mm CSVDataSource is a specialized version of SQL DataSource.
//mm A CSV file contains data in a table form, and is usually exported from a SpreadSheet like Excel.
//mm The DataSource class interface is implemented by many relational databases as a JavaScript interface.
//mm The DataSource interface is used commonly by many applications to read (and manipulate) an SQL database
//mm and it's contained tables.
//mm A CSV file contains a single table, thus it is a subset of functionality of DataSource.
//mm It implements the same basic operation protocol as a DataSource when reading a table from a CSV file.
//mm
//mm ## Responsibilities:
//mm * Read an array of rows (JavaScript Objects) from a CSV file.
//mm * csvFilePath - Pathname to a CSV file.
//mm * map - A mapping of CSV column names to Object property names.
//mm
//mm ## Collaborators:
//mm * NoteList - BibleModel's NoteList uses CVSDataSource to import Notes from other applications (OliveTree).
//mm * DataSource - the superclass from which it inherits the Open, Prepare, All, and Finish operations.
//mm * book - the Book that the note is assciated with.
//mm
//mm ```mermaid
//mm classDiagram
//mm    class CSVDataSource {

//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
export class CSVDataSource extends DataSource {

    constructor(csvFilePath,map) {
        //mm +String   cvsFilePath     - Directory path to the CVS file.
        super(csvFilePath);
        this.csvFilePath = csvFilePath;
        //mm +Map      map         - Map - associates column names to object property names
        this.map = map;
        //mm *String   cvsText      - Raw text of the CVS file
        this.csvText = '';
        //mm +Object  records[]     - array of array of name/value pairs
        this.records = [];
        //mm +String  columns[]     - array of column names
        this.columns = [];
    }

    //mm open()  - open and read the contents of the file specified in cvsFilePath
    async open() {
        this.csvText = fs.readFileSync(this.csvFilePath).toString();
        return this;
    }

    //mm prepare(map) - Sets up criteria for column selection and column name to object property names.
    //mm      The map is array of  object property name to CVS column name.
    //mm     eg: [ "objectProperty1" ==> "tableColumnName1", ... ]
    //mm     cases where the table column name is the same as the desired property name, then no map entry is needed.
    prepare(map) {
        if ( map != undefined && map != undefined)
            this.map = map;
        return this;  // this is the query.
    }

    //mm all() - For each record create a new row and return them all.
    all() {
        this.records = parse(this.csvText, {
            columns: true,
            skip_empty_lines: true
        });

        return this.records;
    }

    //mm finish() - Dispose of any resources.
    finish() {

    }

//mm }
//mm Bible -- NoteList
//mm note for Bible "Bible has a NoteList to hold all Notes"
//mm note for NoteList "NoteList uses CSVDataSource to import notes from CSV files"
//mm NoteList *-- Note
//mm NoteList ..> CSVDataSource
//mm DataSource <|-- CSVDataSource
//mm Book -- NoteList
//mm Book *-- Chapter
//mm Bible *-- Book
//mm Chapter *-- Verse
//mm Book ..> DataSource
//mm Note -- Verse
//mm Note -- Book
//mm Note -- Chapter
//mm ```
//- - - - - - - - - - - end Class definition - - - - - - - - - - -
}