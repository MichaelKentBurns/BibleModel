@Mermaid markup extracted from Bible.mjs
 # Class:  Bible

 An online version of a Study Bible.
 This is the top level (primary) class that represents a web based study Bible.

 ## Responsibilities:
 Provide access to all contained parts.

 ## Collaborators:
 * Testaments - a sequence of Holy texts from different faith communities,
                  specifically Judaism and Christianity.
 * Books - a sequence of writings by various authors that constitutes the Holy Canon of a faith.

 ```mermaid
 classDiagram
    class Bible {
          -bibleNumber              // ordinal among all of the Bibles loaded
          -libraryPath
           +String  translationCode
           +String  translationName
           +Testament[] testaments
           +Book[] books
           +Xrefs[] Xref              // array of cross references
           +DataSource dSource          // database containing persisted data
           +Object  config            // preferences configuration
     ///// statics - medhods belonging to the class, not an instance  ed.  Bible.getBible()
      getBible()$    // returns the singleton Bible
      getBibleNumber(n)$  // returns the nth Bible open
      getNumberOfBibles()$ number     // returns the number of open Bibles
     ///// instance methods - belong to a specific Bible   eg.  aBible.getBooks()
     +getBooks()   Book[]   // returns array of all the books
     ~addTestament(testament)  // add a new testament to the Bible
     ~addBook(book)  // add a new book to the Bible
     ~addXref(xref)  // called from cross reference loading to add a new xref to the list
     ~loadAll()    // Called during Bible init to trigger loading of the various components.
      -stateMachine()       // starts or continues execution of state machine
 }
 class Book {
  +integer ordinal
  +String  name
 }
 Bible *-- Book
 class Testament {
   +integer ordinal
   +String  name
 }
 Bible *-- Testament
 Testament *-- Book
 ```
