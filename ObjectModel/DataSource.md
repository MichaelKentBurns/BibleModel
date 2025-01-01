@Mermaid markup extracted from DataSource.mjs
 # Class:  DataSource

 A generalized class that can read data from either Sqllite3 data files
 or (hopefully) from locally stored json files. 
 
 ## Responsibilities: 
 Open and read at least SQLite3 databases and hopefully json files
 and provide records from the datasources as Javascript object arrays
 or in some cases arrays of database rows that the calling class can 
 easily convert into new objects. 
 
 ## Collaborators: 
 * Theoretically any of the other classes in this project, but specifically:
 * Bible - The description of a specific translation.
 * Book  - The description of a book and it's role in the Bible
 * BookAbbreviation - a class encolsed in the Book class.
 * Note - A textual note associated with any other object in the model.
 * Xref -  A cross reference between two objects with locations in the Bible.
 
 ```mermaid
 classDiagram
 class DataSource{    // a class needed by the project but not part of the real world domain.
     open()  // after details are provided, this function accesses the data file.
    prepare(sqlStatement)   // sets up the query and returns it for doing queries
     finish() // closes access to the data source.
  } 
 Bible --> DataSource
 Book --> DataSource
 Note --> DataSource
 ```
