@Mermaid markup extracted from Note.mjs
 # Class: Note

 A simple note that is associated with a location in the Bible.
 Notes can be loose (no attachment) but to be useful they usually
 are attached to a Book, Chapter, Verse, or even an Xref.

 ## Responsibilities:
 * id - A unique number at least unique with a single Bible.
 * author - The identification of the person who wrote the note.
 * text - the text of the note.
 * Location - Where the note should be displayed in the Bible.

 ## Collaborators:
 * bible - the Bible the note is associated with.
 * book - the Book that the note is assciated with.
 * chapter - the chapter that this note belongs in.
 * verse - the verse this note belongs in.
 * subverse - where in the verse the note belongs.
 * xref - the cross-reference that this note describes.
 ```mermaid
 classDiagram
    class Note {
         +Location location     // Location within the Bible.
         +integer bibleNumber
         +integer bookNumber
         +integer chapterNumber
         +integer verseNumber
         *integer subVerse   // order within a specific verse
         +String author
         +String text        // The actual text of the note.
         +Xref xref      // a cross references
     ~loadAll(aBible)$   // loads all books into the specified Bible
 }
 Bible *-- Note
 Book *-- Note
 Chapter *-- Note
 Verse *-- Note
 Xref *-- Note
 ```
