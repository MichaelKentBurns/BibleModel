import { Location } from './Location.mjs';
import fs from 'node:fs';
import {Bible} from "./Bible.mjs";
let traceNotes = true;

let notesPath;
let allNotes;

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

        //mm +String title        // The title of the note.
        this.title = "";
        //mm +String text        // The actual text of the note.
        this.text = "";
        //mm +Xref xref      // a cross references
        this.xref = 0;
        if (row != undefined) {
            this.location.id = row.location;
            this.chapterNumber = row.c;
            this.verseNumber = row.v;
            this.location.path[0] = row.b;
            this.location.path[1] = row.c;
            this.location.path[2] = row.v;
            this.text = row.text;
            this.title = row.title;
        } else {
            this.text = '';
            this.title = '';
        }

    }

    setTitle(someText) {
        this.title = someText;
    }

    getTitle() {
        return this.title;
    }

    setText(someText) {
        this.text = someText;
    }

    getText() {
        return this.text;
    }

    setAuthor(author) {
        this.author = author;
    }

    getAuthor() {
        return this.author;
    }

    //mm getNotes()$   // return the list of notes
    static getNotes() {
        return allNotes;
    }

    //mm setNotes([Note])$   // set the list of notes
    static setNotes(someNotes) {
        let allNotes = someNotes.clone();
        return allNotes;
    }

    static setNotesPath(){ // sets up info for access Notes.json
        notesPath = Bible.getConfig().MyBiblePath + "/Notes.json";
    }

    //mm ~loadAll()$   // loads all notes
    static loadAll() {
        if ( notesPath === undefined )
            Note.setNotesPath();
        let allNotesText = fs.readFileSync(notesPath, (error) => {
            if (error) {
                console.log('Notes.mjs An error has occurred reading notes', error);
                return null;
            }
        });
        allNotes = JSON.parse(allNotesText);

            if (traceNotes) console.log('Notes read successfully from disk');
            return allNotes;
    }

    //mm ~saveAll()$   // saves all the Notes
    static saveAll = function saveAll() {

        if ( notesPath === undefined )
            Note.setNotesPath();

        if (allNotes !== undefined) {

            // convert JSON object to a string
            const jsonData = JSON.stringify(allNotes)

            // write JSON string to a file
            fs.writeFile(notesPath, jsonData, err => {
                if (err) {
                    throw err
                }
                if (traceNotes) console.log('Notes JSON data is saved.')
            })

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

export default { Note };