@Mermaid markup extracted from Verse.mjs
 # Class: Verse

 A sequence of words and punctuation usually forming one or more sentences.

 ## Responsibilities:
 * number - the sequence number within the chapter
 * text - the text of the verse.

 ## Collaborators:
 * chapter - the chapter that this verse belongs in.
 * xrefs - one or more cross-references originating with this verse.
 * footnotes - usually one, but possibly more footnotes that pertain to this verse.
 ```mermaid
 classDiagram
    class Verse {
         +Location location     // Location within the Bible.
         +integer verseNumber  // The verse number within the chapter.
         +String text        // The actual text of the verse.
         +integer chapterNumber  // The chapter number within the book.
         +Xref[] xrefs      // array of cross references
         +Note[] footnotes  // array of footnotes
     ~loadAll(aBible)$   // loads all books into the specified Bible
 }
 Bible *-- Book
 Book *-- Chapter
 Chapter *-- Verse
 Verse *-- Note
 Verse *-- Xref 
 ```
