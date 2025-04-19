@Mermaid markup extracted from CSVDataSource.mjs
 # Class: CSVDataSource
 CSVDataSource is a specialized version of SQL DataSource.
 A CSV file contains data in a table form, and is usually exported from a SpreadSheet like Excel.
 The DataSource class interface is implemented by many relational databases as a JavaScript interface.
 The DataSource interface is used commonly by many applications to read (and manipulate) an SQL database
 and it's contained tables.
 A CSV file contains a single table, thus it is a subset of functionality of DataSource.
 It implements the same basic operation protocol as a DataSource when reading a table from a CSV file.

 ## Responsibilities:
 * Read an array of rows (JavaScript Objects) from a CSV file.
 * csvFilePath - Pathname to a CSV file.
 * map - A mapping of CSV column names to Object property names.

 ## Collaborators:
 * NoteList - BibleModel's NoteList uses CVSDataSource to import Notes from other applications (OliveTree).
 * DataSource - the superclass from which it inherits the Open, Prepare, All, and Finish operations.
 * book - the Book that the note is assciated with.

 ```mermaid
 classDiagram
    class CSVDataSource {
         +String   cvsFilePath     - Directory path to the CVS file.
         +Map      map         - Map - associates column names to object property names
         *String   cvsText      - Raw text of the CVS file
         +Object  records[]     - array of array of name/value pairs
         +String  columns[]     - array of column names
     open()  - open and read the contents of the file specified in cvsFilePath
     prepare(map) - Sets up criteria for column selection and column name to object property names.
          The map is array of  object property name to CVS column name.
         eg: [ "objectProperty1" ==> "tableColumnName1", ... ]
         cases where the table column name is the same as the desired property name, then no map entry is needed.
     all() - For each record create a new row and return them all.
     finish() - Dispose of any resources.
 }
 Bible -- NoteList
 note for Bible "Bible has a NoteList to hold all Notes"
 note for NoteList "NoteList uses CSVDataSource to import notes from CSV files"
 NoteList *-- Note
 NoteList ..> CSVDataSource
 DataSource <|-- CSVDataSource
 Book -- NoteList
 Book *-- Chapter
 Bible *-- Book
 Chapter *-- Verse
 Book ..> DataSource
 Note -- Verse
 Note -- Book
 Note -- Chapter
 ```
