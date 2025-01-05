import { Location } from './Location.mjs';
import { Book } from './Book.mjs';
import { Chapter } from './Chapter.mjs';


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
    constructor(row) {
        //mm +Location location     // Location within the Bible.
        this.location = new Location();      
        //mm +integer verseNumber  // The verse number within the chapter.
        this.verseNumber = 0;
        //mm +String text        // The actual text of the verse.
        //mm +integer chapterNumber  // The chapter number within the book.
        this.chapterNumber;
        //mm +Xref[] xrefs      // array of cross references
        this.xrefs = [];
        //mm +Note[] footnotes  // array of footnotes
        this.footnotes = [];
        if ( row != undefined ) {
            this.location.id = row.id;
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


    //mm ~loadAll(aBible)$   // loads all books into the specified Bible
    static loadAll(aChapter) {
        let databaseError = undefined;
        const bookNum = aChapter.bookNumber;
        const chapterNum = aChapter.chapterNumber;

        try {
            let newVerses = [Verse];
            let sql = 
                        "SELECT * FROM t_web where b="+bookNum+" and  c="+chapterNum+""
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
//mm Bible *-- Book
//mm Book *-- Chapter
//mm Chapter *-- Verse
//mm Verse *-- Note
//mm Verse *-- Xref 
//mm ```
//- - - - - - - - - - - end Class definition - - - - - - - - - - -

export default { Verse };