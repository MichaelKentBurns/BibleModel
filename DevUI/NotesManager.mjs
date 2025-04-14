// devUI/NotesManager.mjs - A class to unify the display and handling of notes in the devUI
import { Note } from '../Note.mjs';
// import { NoteList } from '../NoteList.mjs';
import { Validation } from '../Validation.mjs';
import { ValidatedTable } from './ValidatedTable.mjs';

import {NoteListUpdateTable, NoteListVerifyArguments} from "./NoteListPostAll.mjs";

//mm # Class: NotesManager   (EXPERIMENTAL CONCEPT)
//mm
//mm A management facility to unify the devUI handling and display of Notes.
//mm
//mm This is a rather unique JavaScript class.  I'm not sure it will work.
//mm It's purpose is to be a clearing house for the HTML elements that display notes,
//mm the functions to massage it, and the presentation related objects.
//mm The reason I think I need this is that the JavaScript namespace is VERY
//mm confusing enough, but when using it within HTML pages in a browser, the
//mm HTML Page namespace and rules are even more confusing.
//mm
//mm ## Responsibilities:
//mm * localNotesArray - An array of Notes stored in the browser.
//mm * serverNotesArray - An array of Notes fetched and posted to the BibleModel server.
//mm * localNotesTable - An HTML table displaying the localNotesArray.
//mm * serverNotesTable - An HTML table displaying the serverNotesArray.
//mm * serverNotesURL - The URL to access notes in the server.
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
//mm    class NotesManager {

// NotesManager is a singleton.  Create it now.
let theNotesManager = undefined;

const notesObjectColumns = ['title','text','reference','author','created','modified'];
const preferencesLocalStorageTag = "BibleModel.prefs";

//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
export class NotesManager {
    //mm  +constructor() NotesManager // initialize the notes manager for the devUI.
    constructor(row) {
        if (theNotesManager)
            return theNotesManager;
        //mm +String title        // The title of the manager.
        this.title = 'NotesManager';
        this.localNotesJSON = '';    // raw text
        this.serverNotesJSON = '';
        this.localNotesObjectArray = [];  // parsed to objects
        this.serverNotesObjectArray = [];
        this.localNotesArray = [];    // cast into Notes
        this.serverNotesArray = [];
        this.localNotesTable = undefined;   // html table element
        this.serverNotesTable = undefined;
        this.localStorageTag = "BibleModel.notes";
        theNotesManager = this;
        this.dataLibrary = "./defaultLibrary";

        this.preferences = JSON.parse(localStorage.getItem(preferencesLocalStorageTag) );
        if ( this.preferences == undefined ) alert("ERROR: No preferences set.  Please visit preferences page first.");
        else {
            this.dataLibrary = this.preferences["MyBiblePath"];
            this.source = this.preferences.accessDataBy;
            this.notesPreferences = this.preferences.notes;
            if ( this.notesPreferences == undefined ) {
                this.preferences.notes
                    = { 'noteSetName' : "", autoReadLocalNotes: false, autoReadPublishedNotes: false };
            }
        }
        this.localNotesValidatedTable = undefined;
        this.serverNotesValidatedTable = undefined;

        this.serverNotesTargetURL = this.setNotesURL();

    }

    static savePreferences() {
        let json = JSON.stringify(theNotesManager.preferences);
        localStorage.setItem(preferencesLocalStorageTag, json);
    }

    setNotesURL(){
        const notesJsonPathname = `../${this.dataLibrary}/notes.json`;
        const serverURL         = `${this.preferences["RESTURL"]}:${this.preferences["RESTPort"]}/Bible/`;
        const notesJsonURL      = `${serverURL}notes`;
        const source = this.preferences["source"];

        let notesText ;
        let notesTarget = null;
        // - - - decide how to access both the file and from the rest server
        if (source == null || source === "file") {
            notesTarget = notesJsonPathname;
        } else {  // for now assume URL for the server.
            notesTarget = notesJsonURL;
        }
        return notesTarget;
    }

    static getNotesManager() {
        if ( theNotesManager === undefined ) {
            theNotesManager = new NotesManager();
        }
        return theNotesManager;  // return the only NotesManager.
    }

    setLocalNotesArray(anArray) {
        this.localNotesArray = anArray;

        if ( this.localNotesValidatedTable != undefined ) {
            this.localNotesValidatedTable.setObjectArray(anArray);
        }
    }

    static getLocalNotesArray() {
        return theNotesManager.localNotesArray;
    }

    static setLocalNotesTable(aTable) {
        theNotesManager.localNotesTable = aTable;
        if ( theNotesManager.localNotesValidatedTable == undefined ) {
            theNotesManager.localNotesValidatedTable
                = new ValidatedTable('Local Notes',Note, theNotesManager.localNotesArray,
                                  notesObjectColumns, theNotesManager.localNotesTable);
        }
        theNotesManager.localNotesValidatedTable.setTableElement(aTable);
        return theNotesManager;
    }
    static getLocalNotesTable() {
        return theNotesManager.localNotesTable;
    }

    static readLocalNotes(){
        theNotesManager.localNotesJSON = localStorage.getItem(theNotesManager.localStorageTag);
        theNotesManager.localNotesObjectArray = JSON.parse(theNotesManager.localNotesJSON);
        theNotesManager.setLocalNotesArray(Note.castMany(theNotesManager.localNotesObjectArray));
        if ( theNotesManager.localNotesArray != undefined )
            console.log("Note: Notes read from local storage: ", theNotesManager.localNotesArray);
        theNotesManager.localNotesValidatedTable.refreshTable();
        return theNotesManager.localNotesArray;
    }
    static writeLocalNotes(){
        let localNotesJSONtext = JSON.stringify(theNotesManager.localNotesArray);
        localStorage.setItem(theNotesManager.localStorageTag, localNotesJSONtext);
    }

    static refreshLocalNotesTable() {
        theNotesManager.localNotesValidatedTable.refreshTable();
    }


    setServerNotesArray(anArray) {
        this.serverNotesArray = anArray;

        if ( this.serverNotesValidatedTable != undefined ) {
            this.serverNotesValidatedTable.setObjectArray(anArray);
        }
        this.serverNotesValidatedTable.refreshTable();

        return this;
    }
    static getServerNotesArray() {
        return theNotesManager.serverNotesArray;
    }
    static setServerNotesTable(aTable) {
        theNotesManager.serverNotesTable = aTable;
        theNotesManager.serverNotesValidatedTable
            = new ValidatedTable('Published Notes',Note, theNotesManager.serverNotesArray,
            notesObjectColumns, theNotesManager.serverNotesTable);
        return theNotesManager.serverNotesValidatedTable;
    }
    static getServerNotesTable() {
        return theNotesManager.serverNotesTable;
    }

    static refreshServerNotesTable() {
        theNotesManager.serverNotesValidatedTable.refreshTable();
    }

    static readPublishedNotes() {
        try {
            fetch(theNotesManager.serverNotesTargetURL,
                {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': 'http://Bible.MichaelKentBurns.com'
                    }
                }
            ).then((response) => response.json())
                .then((notesResult) => {
                    theNotesManager.setServerNotesArray(Note.castMany(notesResult));
                    console.log("notesJSON=", theNotesManager.serverNotesArray);
                    // notesText = JSON.stringify(theNotesManager.serverNotesArray);
                });
        } catch (error) {
            console.log("Error trying to get notes data: ", error);
            notesError = JSON.stringify(error);
            console.log("Error getting ", url, " : ", notesError);
        }

        // now refresh the table
        theNotesManager.serverNotesValidatedTable.refreshTable();
        return true;
    }

    static postNotes() {
        try {
            fetch(theNotesManager.serverNotesTargetURL + "?action=replace",
                {
                    method: "POST",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': 'http://Bible.MichaelKentBurns.com'
                    },
                    body: JSON.stringify(theNotesManager.localNotesArray)
                }
            ).then((response) => response.json())
                .then((notesResult) => {
                    theNotesManager.setServerNotesArray(Note.castMany(notesResult));
                    console.log("notesJSON=", theNotesManager.serverNotesArray);
                   // notesText = JSON.stringify(theNotesManager.serverNotesArray);
                });
        } catch (error) {
            console.log("Error trying to post notes data: ", error);
            notesError = JSON.stringify(error);
            console.log("Error posting ", url, " : ", notesError);
        }
        console.log("NotesManager.postNotes complete.")

        // now refresh the table
       // NoteListUpdateTable(theNotesManager.localNotesTable, theNotesManager.localNotesArray);
        NoteListUpdateTable(theNotesManager.serverNotesTable, theNotesManager.serverNotesArray);
        return true;
    }
}

//mm }
//mm ```
//- - - - - - - - - - - end Class definition - - - - - - - - - - -

export default { NotesManager };
