import { Location } from './Location.mjs';

//mm # Class: Verse
//mm
//mm A sequence of words and punctuation usually forming one or more sentences.
//mm
//mm ## Responsibilities:
//mm * number - the sequence number within the chapter
//mm * text - the text of the verse.
//mm
//mm ## Collaborators:
//mm * chapter - the chapter that this verse belongs in.
//mm * xrefs - one or more cross-references originating with this verse.
//mm * footnotes - usually one, but possibly more footnotes that pertain to this verse.
//mm ```mermaid
//mm classDiagram
//mm    class Verse {

//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
export class Verse {
    constructor() {
        //mm +Location location     // Location within the Bible.
        this.location = new Location();      
        //mm +integer verseNumber  // The verse number within the chapter.
        this.verseNumber = 0;
        //mm +String text        // The actual text of the verse.
        this.text = '';
        //mm +integer chapterNumber  // The chapter number within the book.
        this.chapterNumber;
        //mm +Xref[] xrefs      // array of cross references
        this.xrefs = [];
        //mm +Note[] footnotes  // array of footnotes
        this.footnotes = [];
    }

    setVerseNumber(anInteger) {
        this.verseNumber = anInteger;
    }
    verseNumber() {
        return this.verseNumber;
    }

    setText(someText) {
        this.text = someText;
    }
    text() {
        return this.text;
    }

    setChapter(aChapter) {
        this.chapter = aChapter;
    }

    chapterNumber() {
        return this.chapterNumber;
    }

    chapter() {
        return this.chapter;
    }

    addXref(anXref) {
        this.xrefs.push(xref);
    }

    xrefs() {
        return this.xrefs;
    }

    addFootnote(aFootnote) {
        this.footnotes.push(aFootnote);
    }

    footnotes() {
        return this.footnotes;
    }

}
//mm }
//mm Bible *-- Book
//mm Book *-- Chapter
//mm Chapter *-- Verse
//mm Verse *-- Note
//mm Verse *-- Xref 
//mm ```
//- - - - - - - - - - - end Class definition - - - - - - - - - - -

export default { Verse };