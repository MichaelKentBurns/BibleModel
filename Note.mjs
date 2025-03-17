import { Location } from './Location.mjs';
import { Validation } from './Validation.mjs';

let traceNotes = true;

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
    //mm  +constructor() Note // make a new Note
    constructor(row) {
        //mm +String title        // The title of the note.
        this.title = '';
        //mm +String text        // The actual text of the note.
        this.text = '';
        //mm +Date  created        // when first created
        let newDate = new Date();
        this.created = newDate;
        //mm *Date  modified       // last time modified
        this.modified = undefined;  
        //mm +String author
        this.author = '';
        //mm +String   reference    // textual location or other reference point
        this.reference = '';
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

        //mm +Xref xref      // a cross references
        this.xref = 0;
        if (row != undefined) {
            this.title = row.title;
            this.text = row.text;
            this.created = row.created;
            this.modified = row.modified;
            this.author = row.author;
            this.reference = row.reference;
            this.location.id = row.location;
            this.chapterNumber = row.c;
            this.verseNumber = row.v;
            this.location.path[0] = row.b;
            this.location.path[1] = row.c;
            this.location.path[2] = row.v;
        }

    }

    //mm setTitle(String someText)$ Note  // sets the title and returns this
    setTitle(someText) {
        this.title = someText;
        return this;
    }

    //mm getTitle()$ String // returns the string value of title
    getTitle() {
        return this.title;
    }

    //mm setText(String someText)$ Note  // sets the text and returns this
    setText(someText) {
        this.text = someText;
        return this;
    }

    //mm getText()$ String // returns the string value of text
    getText() {
        return this.text;
    }

    //mm setReference(String referenceString )$ Note  // interprets text reference and sets reference
    setReference(reference) {
        let parts = reference.split(' ');
        if (parts.length > 0) {
            let bookNumber = parts[1];
            this.location.path[0] = bookNumber;
            if ( parts.length > 1 ) {
                let chapterNumber = parts[2];
                this.location.path[1] = chapterNumber;
                if ( parts.length > 2) {
                    let verseNumber = parts[3];
                    this.location.path[2] = verseNumber;
                }
            }
        }
        return this;
    }

    //mm getReferenceText()$ String // returns the string value of reference
    getReference() {
        return this.location.toString();
    }

    //mm setAuthor(String someText) Note  // sets the author and returns this
    setAuthor(someText) {
        this.author = someText;
        return this;
    }

    //mm getAuthor() String // returns the authors name or initials
    getAuthor() {
        return this.author;
    }

    //mm validate()  Validation  // validates properties and return the validation
    validate() {
        let validation = new Validation( `validation of Note titled ${this.title}`, this);

        if ( this.title === undefined || this.title.length === 0 ) {
            validation.addError('title','Notes require a title string');
        }
        else validation.addValid('title');

        if ( this.text === undefined || this.text.length === 0 ) {
            validation.addWarning('text','Notes should have some text.');
        }
        else validation.addValid('title');

        const currentDate = new Date();
        if ( this.created === undefined || isNaN(this.created)  ) {
            validation.addError('created','Notes require a creation date');
        }
        else if ( this.created > currentDate ) {
            validation.addWarning('created',"Notes should not have a future creation date");
        }
        else validation.addValid('created');

        if ( this.author === undefined || this.author.length === 0 ) {
            validation.addWarning('author','Notes should have an author.');
        }
        else validation.addValid('author');

        return validation;
    }

    //mm cast(noteLikeObject) Note   // create a new Note object from something that has the right attributes
    //mm     Please note that when a real Note is fetched from the server or read in from a file,
    //mm     it is NOT a real Note instance.  This cast will make it into an official Note and return that.
    static cast(noteLikeObject){
        return new Note(noteLikeObject);
    }
    static castMany(arrayOfNoteLikeObjects){
        const newNoteList = new Array();
        if (arrayOfNoteLikeObjects) {
            arrayOfNoteLikeObjects.forEach(noteLikeObject => {
                const newNote = new Note(noteLikeObject);
                 newNoteList.push(newNote);
            });
        }
        return newNoteList;
    }
}
//mm }
//mm NoteList *-- Note
//mm Bible -- NoteList
//mm Book -- NoteList
//mm Chapter -- NoteList
//mm Verse -- NoteList
//mm Xref -- NoteList
//mm ```
//- - - - - - - - - - - end Class definition - - - - - - - - - - -

export default { Note };