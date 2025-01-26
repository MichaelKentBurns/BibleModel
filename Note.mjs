import { Location } from './Location.mjs';
import { Bible } from './Bible.mjs';
import { Book } from './Book.mjs';
import { Chapter } from './Chapter.mjs';
import { Verse } from './Verse.mjs';
import { Xref } from './Xref.mjs';

//mm # Class: Note
//mm
//mm A simple note that is associated with a location in the Bible.
//mm Notes can be loose (no attachment) but to be useful they usually
//mm are attached to a Book, Chapter, Verse, or even an Xref.
//mm
//mm ## Responsibilities:
//mm * id - A unique number at least unique with a single Bible.
//mm * author - The identification of the person who wrote the note.
//mm * text - the text of the note.
//mm * Location - Where the note should be displayed in the Bible.
//mm
//mm ## Collaborators:
//mm * bible - the Bible the note is associated with.
//mm * book - the Book that the note is assciated with.
//mm * chapter - the chapter that this note belongs in.
//mm * verse - the verse this note belongs in.
//mm * subverse - where in the verse the note belongs.
//mm * xref - the cross-reference that this note describes.
//mm ```mermaid
//mm classDiagram
//mm    class Note {

//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
export class Note {
    constructor(row) {
        //mm +Location location     // Location within the Bible.
        this.location = new Location();
        //mm +integer bibleNumber
        this.bibleNumber = 0;
        //mm +integer bookNumber
        this.bookNumber = 0;
        //mm +integer chapterNumber
        this.chapterNumber = 0;
        //mm +integer verseNumber
        this.verseNumber = 0;
        //mm *integer subVerse   // order within a specific verse
        this.subverse = 0;
        //mm +String author
        this.author = "";
        //mm +String text        // The actual text of the note.
        this.text = "";
        //mm +Xref xref      // a cross references
        this.xref = 0;
        if ( row != undefined ) {
            this.location.id = row.location;
            this.chapterNumber = row.c;
            this.verseNumber = row.v;
            this.location.path[0] = row.b;
            this.location.path[1] = row.c;
            this.location.path[2] = row.v;
            this.text = row.t;
        }
        else
        {
            this.text = '';
        }

    }

    setText(someText) {
        this.text = someText;
    }
    text() {
        return this.text;
    }

    setAuthor(author) {
        this.author = author;
    }
    author() {
        return this.author;
    }

    setBible(aBible) {
        this.bibleNumber = aBible.bibleNumber;
    }
    bibleNumber() {
        return this.bibleNumber;
    }

    setBook(aBook) {
        this.bookNumber = aBook.bookNumber;
    }

    bookNumber() {
        return this.bookNumber;
    }

    setChapter(aChapter) {
        this.chapter = aChapter;
    }

    chapterNumber() {
        return this.chapterNumber;
    }
    setVerseNumber(anInteger) {
        this.verseNumber = anInteger;
    }
    verseNumber() {
        return this.verseNumber;
    }


    chapter() {
        return this.chapter;
    }

    setXref(anXref) {
        this.xrefs xref;
    }

    xrefs() {
        return this.xrefs;
    }

    //mm ~loadAll(aBible)$   // loads all books into the specified Bible
    static loadAll(aChapter) {
        let databaseError = undefined;
        const bookNum = aChapter.bookNumber;
        const chapterNum = aChapter.chapterNumber;

        try {
            let newVerses = [Verse];
            let sql =
                `SELECT * FROM t_web where b=${bookNum} and  c=${chapterNum}`
            ;

            const dSource = Book.theBible.dSource;
            const query = dSource.prepare(sql);
            const rows = query.all();
            // dSource.finish(query);

            // As each row is read from the database this
            // forEach loop is run.  In that loop the row
            // is used to build a new Book object which is
            // then added to the array of books in theBible.
            rows.forEach((row) => {
                const verse = new Verse(row);
                aChapter.addVerse(verse);
            });

            // close the database connection
            // database.close();
            return undefined; // no errors.
        } catch (error) {
            databaseError = error;
            console.log("Verse ERROR: encountered reading verses from database.", error);
            return databaseError;
        }
    }

}
//mm }
//mm Bible *-- Note
//mm Book *-- Note
//mm Chapter *-- Note
//mm Verse *-- Note
//mm Xref *-- Note
//mm ```
//- - - - - - - - - - - end Class definition - - - - - - - - - - -

export default { Verse };