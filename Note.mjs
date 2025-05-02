import {Location} from './Location.mjs';
import {Validation} from './Validation.mjs';

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
const propNames = ['title', 'text', 'created', 'modified', 'author', 'reference', 'location'];

export class Note {

    //mm  +constructor() Note // make a new Note
    constructor(row, map) {
        //mm +String title        // The title of the note.
        this.title = '';
        //mm +String text        // The actual text of the note.
        this.text = '';
        //mm +Date  created        // when first created
        this.created = new Date();
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
            propNames.forEach(propName => {
                Note.mapProperty(this, propName, map, row);
            });
            //  this.location.id = row.location;
            this.chapterNumber = row.c;
            this.verseNumber = row.v;
            //  this.location.path[0] = row.b;
            //  this.location.path[1] = row.c;
            //  this.location.path[2] = row.v;
        }

    }

    //  find propName in row as-is or after checking the map.
    static mapProperty(newObject, propName, map, row) {
        let value = row[propName];
        if (value === undefined) {
            if (map != undefined) {
                let alternateName = map.get(propName);
                if (alternateName != null) {
                    let value = row[alternateName];
                }
            }
        }
        if (value !== undefined) {
            if (propName == "created") {
                newObject.setCreated(value);
            } else if (propName == "modified") {
                newObject.setModified(value);
            } else newObject[propName] = value;
        }
    }

    setCreated(someText) {
        if (typeof someText === "string")
            this.created = new Date(someText);
        else
            this.created = someText;
    }

    setModified(someText) {
        if (typeof someText === "string")
            this.modified = new Date(someText);
        else
            this.modified = someText;
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
            this.location.path[0] = parts[1];
            if (parts.length > 1) {
                this.location.path[1] = parts[2];
                if (parts.length > 2) {
                    this.location.path[2] = parts[3];
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
        let validation = new Validation(`validation of Note titled ${this.title}`, this);

        if (this.title === undefined || this.title.length === 0) {
            validation.addError('title', 'Notes require a title string');
        } else validation.addValid('title');

        if (this.text === undefined || this.text.length === 0) {
            validation.addWarning('text', 'Notes should have some text.');
        } else validation.addValid('title');

        const currentDate = new Date();
        let testDate = this.created;
        if (testDate instanceof Date) {
            if (isNaN(testDate)) {
                validation.addError('created', 'Notes require a creation date');
            } else {
                if (testDate > currentDate) {
                    validation.addWarning('created', "Notes should not have a future creation date");
                } else validation.addValid('created');
            }
        } else {
            validation.addError('created', 'Creation date is not a valid Date');
        }

        if (this.author === undefined || this.author.length === 0) {
            validation.addWarning('author', 'Notes should have an author.');
        } else validation.addValid('author');

        if (this.reference === undefined || this.reference.length === 0) {
             if (this.title != undefined && this.title.length > 1) {
                 // no reference, lets test the title to see if that will work.
                 let testLocation = Location.referenceToLocation(this.title);
                 if (testLocation) {
                     this.reference = this.title;
                 }
             } else {
                 validation.addWarning('author', 'Notes should have an reference.');
             }
            if ( this.reference != undefined && this.reference.length > 0 ) {

            let stripped = this.reference.replace( /^\s*/, '' );
            if ( stripped > 0) {
                let testLocation = Location.referenceToLocation(stripped);
                if (testLocation === undefined || testLocation.length === 0) {
                    validation.addWarning('reference',
                        `Notes should have a valid reference not ${testLocation}`);
                } else {
                    this.location = testLocation;
                    validation.addValid('author');
                }

            }
            }
        }
        return validation;

    }

        //mm cast(noteLikeObject) Note   // create a new Note object from something that has the right attributes
        //mm     Please note that when a real Note is fetched from the server or read in from a file,
        //mm     it is NOT a real Note instance.  This cast will make it into an official Note and return that.
        static
        castOne(noteLikeObject)
        {
            return new Note(noteLikeObject);
        }

        static
        castMany(arrayOfNoteLikeObjects, map)
        {
            const newNoteList = [];
            if (arrayOfNoteLikeObjects) {
                arrayOfNoteLikeObjects.forEach(noteLikeObject => {
                    const newNote = new Note(noteLikeObject, map);
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

    export
    default {
    Note
};