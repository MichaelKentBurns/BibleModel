
import { Book } from './Book.mjs';  // makes promiseToReadBooks
import { Location } from './Location.mjs';
import { Verse } from './Verse.mjs';



//mm # Class:  Chapter
//mm
//mm A sequence of verses, usually a logical division of the text.
//mm Chapter divisions are NOT part of the inspired holy text, but were imposed by
//mm copyists to break the text into more manageable parts.
//mm 
//mm ## Responsibilities: 
//mm One of a collection of Chapters that make up a Book.  Identified by a number starting with 1.
//mm May have a caption that describes the context for the verses.
//mm May have Notes attached that contain background and commentary.
//mm Provides access to each of a sequence of Verses.
//mm 
//mm ## Collaborators: 
//mm * Book  - The larger container that contains this chapter from the series.
//mm * Note - A textual note associated with any other object in the model.
//mm * Xref -  A cross reference between two objects with locations in the Bible.
//mm * Verse - Chapter contains a sequence of verses. 
//mm
//mm ```mermaid
//mm classDiagram
//mm 
//mm    class Chapter {     
export class Chapter {
    constructor(book, chapterNumber) {
        //mm +Location location    // Location within the Bible.
        this.location = new Location();
        //mm +integer bookNumber  // The book that this chapter is part of.
        this.bookNumber = book.bookNumber;
        //mm +integer chapterNumber // The chapter number within the book
        this.chapterNumber = chapterNumber;
        //mm +String caption   // A short caption for the chapter.
        this.caption = "";
        //mm +Note[] notes    // descriptive notes.
        this.notes = [];
        //mm +Verse[] verses   // an array of enclosed verses.
        this.verses = [];

        this.location.setBook(book.bookNumber);
        this.location.setChapter(this.chapterNumber);
        this.location.getId();  // establishes id from path. 

    }

    addNote(aNote) {
        this.notes.push(aNote);
    }
    addVerse(aVerse) {
        aVerse.chapterNumber = this.chapterNumber ;
        this.verses.push(aVerse);
    }

    //mm ~loadConetnts(aChapter)$   
    static loadContents(aChapter) {
        Verse.loadAll(aChapter);
        return aChapter;
    }

}
//mm }
//mm Book *-- Chapter
//mm Chapter *-- Verse
//mm ```

export default {
    Chap: Chapter
};