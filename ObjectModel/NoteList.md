@Mermaid markup extracted from NoteList.mjs
 # Class: NoteList

 Please know that this documentation is still IN PROGRESS.

 A list of Note objects that can be handled as a single unit when
 being moved from the UI to the REST server, or from the REST server
 to permanent storage.

 The attributes of this list mirror the attributes of a Note itself.
 This is because a NoteList often has attributes that describe the
 common features of the individual notes themselves.

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
    class NoteList {
         +Note[]  noteList      // simple array of notes.
         +Location location     // Location within the Bible.
         +integer bibleNumber
         +integer bookNumber
         +integer chapterNumber
         +integer verseNumber
         *integer subVerse   // order within a specific verse
         +String author
         +String title        // The title of the note.
         +String text        // The actual text of the note.
         +Xref xref      // a cross references
     getNotes()$   // return the list of notes
     setNotes([Note])$   // set the list of notes
     ~loadAll()$   // loads all notes
     ~saveAll()$   // saves all the Notes
 }
 NoteList *-- Note
 Bible -- NoteList
 Book -- NoteList
 Chapter -- NoteList
 Verse -- NoteList
 Xref -- NoteList
 ```
