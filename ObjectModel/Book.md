Mermaid markup extracted from Book.mjs
  # Class:  Book

  A holy writing considered as part of the Canon of a faith.
  A Book is ultimately a sequence of words with appropriate punctuation.
  In modern forms it is composed of a sequence of chapters.
  Usually attributed to a specific author.

  ### Responsibilities:
  * The formal name.
  * A longer descriptive name.
  * Abbreviations for the name.
  * The name of the author.
  * Introductory text.

  ### Collaborators:
  * The Bible that contains this book.
  * The Testament that contains this book.
  * Chapters - A sequence of numbered chapters that form this book.

 ```mermaid
 classDiagram
  class BookAbbreviation{     // internal class for book name abbreviations
         ~integer id
         ~String name
         ~integer bookNumber
         ~boolean isPrimary
 }
 Book *-- BookAbbreviation
  class Book {
             +integer ordinal   // ordinal among all Books in a Bible
             +String name  // short and unique name of the book
             +String title  // longer descriptive name of the book
             +String category  // one of several categories of books
             +integer nChapters  // number of chapters in this book
     Bible theBible$   // first and possibly only Bible loaded
     BookAbbreviation abbreviationList[]$   // array of abbreviation names
     Map[String name: integer bookOrdinal]$   // map of names to book ordinals
     getBookByName(String name)$ Book   // returns a book by name or abbreviation
     getBookByNumber(ordinal)$ Book   // returns a book by it's ordinal
     ~setBible(aBible)$   // sets the Bible that contains this book
     ~loadAll(aBible)$   // loads all books into the specified Bible
     ~saveAll(theBible)$   // saves all the Books in a Bible to books json file
     ~saveAbbreviations(theBible)$   // saves all of the book abbreviations to a json file
   }
 ```
[<a href="https://mermaid.live/edit#pako:eNpdkTFPwzAQhf-K5QlQ2zQJJG1UBaGWDYmBgYEwXO1LYuTEwXYqlZL_jt02asXm--690zvfgTLFkWaUSTBmI6DS0BTt2lfzkKx-p1PytEO9f1FtdaQkI2ulZNGuVqK1qEtgmOfk7BitSzKdOhg59XuNGgk0RDxed-_IOr6uf8cZ6UhTZ8bvHqS5ub1mr9svZPbjk6DEBlu7AQuXyBkx4gcvDk9cUMJq0XT_YaW0kNK5j-ufAoRzcihaQvLcoN4Jv50vvVxw_xrnD3RCG9QNCO4-8OgpqK1dpoJm7smxhF7agp6kfcfB4jMXVmmalW4tnFDorXrbt4xmVvc4is53GKFUwNF5DtTuO3-sShjrJjLVlqLyvNfS4drazmRB4NuzSti6386YagIjeA3a1rtlEiRRsoAoxiSN4SGOOduGy0UZ3YclT-dhBHQYhj8dc6_I">Open Mermaid Live editor</a>]
