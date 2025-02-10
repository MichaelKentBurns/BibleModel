console.log("Begin NotesData");
import note, { Note } from "../Note.mjs";
// import { RestClient2 } from "./RestClient2.js";
let useFs = false;
if ( useFs ) {
 //   import { fs } from 'node:fs';
}

const preferencesLocalStorageTag = "BibleModel.prefs";
const preferences = JSON.parse(localStorage.getItem(preferencesLocalStorageTag) );
if ( preferences != undefined ) console.log("Note: Preferences read from local storage: ", preferences);

const localStorageTag = "BibleModel.notes";
let bibleNotes;

bibleNotes
    = JSON.parse(localStorage.getItem(localStorageTag) || "[]");
console.log("bibleNotes=",bibleNotes);

let notesText = JSON.stringify(bibleNotes);
document.getElementById("notesData").textContent = notesText;

// Put the fetched data in the html table of html file.
updateTable(notesTable,bibleNotes);


function saveAll(notesData) {

    let filePathname = preferences.MyBiblePath + "/Notes.json";
        // convert JSON object to a string

        // write JSON string to a file
        fs.writeFile(filePathname, notesData, err => {
            if (err) {
                throw err
            }
            if (traceNotesData) console.log(`Notes JSON data is saved to $filePathname`);
        })
}

if ( useFs ) {
    saveAll(notesText);
}