@Mermaid markup extracted from Book.mjs
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
  class BookAbbreviation {     // internal class for book name abbreviations
         ~integer id
         ~String name
         ~integer bookNumber
         ~boolean isPrimary
 }
 Book *-- BookAbbreviation
  class Book {
             +integer ordinal;     // ordinal among all Books in a Bible
             +integer bookNumber;   // same as ordinal
             +String name  // short and unique name of the book
             +String title  // longer descriptive name of the book
             +String category  // one of several categories of books
             +integer nChapters  // number of chapters in this book
             +Chapter chapters[]
             +Location location;   // location within the Bible
          integer firstXref
          integer lastXref
     Bible theBible$   // first and possibly only Bible loaded
     BookAbbreviation abbreviationList[]$   // array of abbreviation names
     Map[String name: integer bookOrdinal]$   // map of names to book ordinals
     getBookByName(String name)$ Book   // returns a book by name or abbreviation
     getBookByNumber(ordinal)$ Book   // returns a book by it's ordinal
     ~setBible(aBible)$   // sets the Bible that contains this book
     ~loadConetnts(aBook)$   
     ~loadAll(aBible)$   // loads all books into the specified Bible
     ~saveAll(theBible)$   // saves all the Books in a Bible to books json file
     ~saveAbbreviations(theBible)$   // saves all of the book abbreviations to a json file
 }
 Bible *-- Book
 Book *-- Chapter
 Chapter *-- Verse
 Book *-- Note
 ```
