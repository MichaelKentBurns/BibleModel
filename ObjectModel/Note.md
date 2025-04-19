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
      +constructor() Note // make a new Note
         +String title        // The title of the note.
         +String text        // The actual text of the note.
         +Date  created        // when first created
         *Date  modified       // last time modified
         +String author
         +String   reference    // textual location or other reference point
         +Location location     // Location within the Bible.
         +integer bibleNumber
         +integer bookNumber
         +integer chapterNumber
         +integer verseNumber
         *integer subVerse   // order within a specific verse
         +Xref xref      // a cross references
     setTitle(String someText)$ Note  // sets the title and returns this
     getTitle()$ String // returns the string value of title
     setText(String someText)$ Note  // sets the text and returns this
     getText()$ String // returns the string value of text
     setReference(String referenceString )$ Note  // interprets text reference and sets reference
     getReferenceText()$ String // returns the string value of reference
     setAuthor(String someText) Note  // sets the author and returns this
     getAuthor() String // returns the authors name or initials
     validate()  Validation  // validates properties and return the validation
     cast(noteLikeObject) Note   // create a new Note object from something that has the right attributes
         Please note that when a real Note is fetched from the server or read in from a file,
         it is NOT a real Note instance.  This cast will make it into an official Note and return that.
 }
 NoteList *-- Note
 Bible -- NoteList
 Book -- NoteList
 Chapter -- NoteList
 Verse -- NoteList
 Xref -- NoteList
 ```
