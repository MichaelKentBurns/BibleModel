import { Location } from './Location.mjs';
import fs from 'node:fs';
import {Bible} from "./Bible.mjs";
import {Note} from "./Note.mjs";

import {RESTendpoint} from "./Servers/RESTServer/RESTendpoint.mjs";
let traceNoteList = true;
let traceNoteListData = true;

let notesPath;
let allNotes;

//mm # Class: NoteList
//mm
//mm Please know that this documentation is still IN PROGRESS.
//mm
//mm A list of Note objects that can be handled as a single unit when
//mm being moved from the UI to the REST server, or from the REST server
//mm to permanent storage.
//mm
//mm The attributes of this list mirror the attributes of a Note itself.
//mm This is because a NoteList often has attributes that describe the
//mm common features of the individual notes themselves.
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
//mm    class NoteList {

//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
export class NoteList {
    constructor(row) {
        //mm +Note[]  noteList      // simple array of notes.
        this.noteList = [];
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
        // Currently, we only support one collection of notes.   
        // I'm sure in the future we may want to have a series of Notes files.
        // I could add a path parameter to loadAll and use that rather than this default.
        if ( notesPath === undefined )
            NoteList.setNotesPath();

        let allNotesText = fs.readFileSync(notesPath, (error) => {
            if (error) {
                console.log('Notes.mjs An error has occurred reading notes', error);
                return null;
            }
        });
        let allNotesTemp = JSON.parse(allNotesText);
        allNotes = Note.castMany(allNotesTemp);
        // Future: the new notes are dumb objects, not instances of a class.
        // I'm not sure what all the ramifications are, but there are bound to be some.
        // As a result, we could add code here to turn each array item into a real Note.

        // Since we now have loaded Notes, this is a good time to enable all 
        // of the Notes related REST endpoints.  Before this all requests will be 
        // rejected. 
        NoteList.registerEndpoints();

        if (traceNoteList) console.log('Notes read successfully from disk');
        return allNotes;
    }

    //mm ~saveAll()$   // saves all the Notes
    static saveAll = function saveAll() {

        if ( notesPath === undefined )
            NoteList.setNotesPath();

        if (allNotes !== undefined) {

            // convert JSON object to a string
            const jsonData = JSON.stringify(allNotes)

            // write JSON string to a file
            fs.writeFile(notesPath, jsonData, err => {
                if (err) {
                    throw err
                }
                if (traceNoteList) console.log('Notes JSON data is saved.')
            })

        }
    }

    static handleNotes( endpoint, request, response, urlArray, urlOptionsArray ) {
        if ( request.method === 'GET' )
        {
            response.setHeader("Content-Type","application/json");
            response.writeHead(200);
            response.end( JSON.stringify(NoteList.getNotes()) + '\n');
        } else if ( request.method === 'POST' )
        {
            let checkNoteError; 
            let postedNotes = request.body;
            // POST of an array of notes default is to simply append 
            // all of the new entries to the existing set of notes.

            // I anticipate options on the request:
            // * Evaluate and digest newly posted notes.
            let x = 1;
            let action = '';  // replace, delete, sort
            let orderBy = '';
            let direction = '';
            let urlOptions = request.url.split('?')[1];
            if (traceNoteList) console.log("URL options=" + urlOptions);
            if (urlOptions != undefined) {
        
                let optionArray = urlOptions.split('&');
                if (traceNoteList) console.log("URL option array=" + optionArray);
        
                for (let i = 0; i < optionArray.length; i++) {
                    let item = optionArray[i].split('=');
                    if (item[0] === "action") {
                        action = item[1];
                    } else if (item[0] === "orderBy") {
                        orderBy = item[1];
                    } else if (item[0] === "ascending") {
                        direction = item[0];
                    } else if (item[0] === "descending") {
                        direction = item[0];
                    }
                }
                if (traceNoteList) console.log("action=" + action + " orderBy=" + orderBy + " direction=" + direction);
            }

            if (traceNoteListData) 
                 console.log("POST notes before allNotes length=", allNotes);
            postedNotes.forEach( (item, index) =>  {
                // aNote = [Note] item;
                // First do some basic checks for integrity.
                if ( action === 'replace') {
                    let itemCreateTime = undefined;
                    if ( item.created != undefined )
                        itemCreateTime = item.created;
                    let itemModTime = undefined;
                    if ( item.modified != undefined )
                        itemModTime = item.modified;
                    let replaceCount = 0;
                    allNotes.forEach( (current, curIndex) => {
                       if ( itemCreateTime != undefined && current != undefined && current.created != undefined && itemCreateTime === current.created ) {
                        // same object. replace
                        replaceCount = replaceCount + 1;
                        if (traceNoteListData) 
                            console.log(`NoteList.POST item at index ${curIndex} replaced by new item at ${index} replacement #${replaceCount}`);
                        if ( replaceCount > 1 )
                            allNotes[curIndex] = undefined;   // just remove it
                          else
                            allNotes[index] = item;   // replace item in place
                        item = undefined;
                       }
                    });
                }
                if ( item != undefined )    
                    allNotes.push(item);
            });
            console.log("POST notes after push allNotes length=", allNotes);

            // Options that operate on the final list of notes. 
            // * Eliminate duplicates.
            // * Sort the final list.
    

            // After that is done, save them to storage.
            NoteList.saveAll();
            // and then return the result back to the client. 
            response.setHeader("Content-Type","application/json");
            response.writeHead(200);
            response.end( JSON.stringify(NoteList.getNotes()) + '\n');
        }
    }

    static handleNote( endpoint, request, response, urlArray, urlOptionsArray ) {
        if ( request.method === 'GET' )
        {
            let noteNumber = urlArray[3];
            let note = NoteList.getNotes()[noteNumber];
            response.setHeader("Content-Type","application/json");
            response.writeHead(200);
            response.end(JSON.stringify(note) + '\n');
        }
    }

    static registerEndpoints(){
        let endpoint;
        endpoint = new RESTendpoint( "notes", Bible, NoteList.handleNotes );
        RESTendpoint.registerEndpoint( endpoint );
        endpoint = new RESTendpoint( "note", Bible, NoteList.handleNote );
        RESTendpoint.registerEndpoint( endpoint );
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

export default { NoteList };