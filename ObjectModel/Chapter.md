@Mermaid markup extracted from Chapter.mjs
 # Class:  Chapter

 A somewhat arbitrary sequence of Verses that are a logical subdivision of a Book.
 
 ## Responsibilities: 
 One of a collection of Chapters that make up a Book.  Identified by a number starting with 1.
 May have a caption that describes the context for the verses.
 May have Notes attached that contain background and commentary.
 Provides access to each of a sequence of Verses.
 
 ## Collaborators: 
 * Book  - The larger container that contains this chapter from the series.
 * Note - A textual note associated with any other object in the model.
 * Xref -  A cross reference between two objects with locations in the Bible.
 * Verse - Chapter contains a sequence of verses. 
 
 ```mermaid
 classDiagram

 # Class: Chapter

 A sequence of verses, usually a logical division of the text.
 Chapter divisions are NOT part of the inspired holy text, but were imposed by
 copyists to break the text into more manageable parts.
 
 ## Responsibilities:
 * author - the name of the person considered to have written it.
 * number - a sequence number in the book
 * Provides access to verses by number or a range of numbers.
 
 ## Collaborators:
 * book - the book that contains this chapter
 * verses - a numbered sequence of verses

 ```mermaid
 classDiagram
 
    class Chapter {     
         +Book book;  // The book that this chapter is part of.
         +integer chapterNumber; 
         +String caption;   // A short caption for the chapter.
         +Note[] notes;     // descriptive notes.
         +Verse[] verses;   // an array of enclosed verses.
 Book *== Chapter
 Chapter *== Verse
 ```