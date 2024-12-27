Mermaid markup extracted from Bible.mjs
```mermaid

  Class:  Bible

  An online version of a Study Bible.
 This is the top level (primary) class that represents a web based study Bible.

  Responsibilities:
      Provide access to all contained parts.

  Collaborators:
      Testaments - a sequence of Holy texts from different faith communities,
                  specifically Judaism and Christianity.
      Books - a sequence of writings by various authors that constitutes the Holy Canon of a faith.

 classDiagram
    class Bible {
          -bibleNumber   // ordinal among all of the Bibles loaded
          -libraryPath
           +String  translationCode
           +String  translationName
           +Testament[] testaments
           +Book[] books
           +Xrefs[] Xref              // array of cross references
           +DataSource dSource          // database containing persisted data
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
[<a href="https://mermaid.live/edit#pako:eNpdkTFPwzAQhf-K5QlQ2zQJJG1UBaGWDYmBgYEwXO1LYuTEwXYqlZL_jt02asXm--690zvfgTLFkWaUSTBmI6DS0BTt2lfzkKx-p1PytEO9f1FtdaQkI2ulZNGuVqK1qEtgmOfk7BitSzKdOhg59XuNGgk0RDxed-_IOr6uf8cZ6UhTZ8bvHqS5ub1mr9svZPbjk6DEBlu7AQuXyBkx4gcvDk9cUMJq0XT_YaW0kNK5j-ufAoRzcihaQvLcoN4Jv50vvVxw_xrnD3RCG9QNCO4-8OgpqK1dpoJm7smxhF7agp6kfcfB4jMXVmmalW4tnFDorXrbt4xmVvc4is53GKFUwNF5DtTuO3-sShjrJjLVlqLyvNfS4drazmRB4NuzSti6386YagIjeA3a1rtlEiRRsoAoxiSN4SGOOduGy0UZ3YclT-dhBHQYhj8dc6_I">Open Mermaid Live editor</a>]
