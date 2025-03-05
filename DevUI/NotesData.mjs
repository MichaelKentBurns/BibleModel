// NotesData.mjs - fetch notes from localStorage.
// If there is a table in the current document to receive it, then populate that table.
// If there is a paragraph in the current document to receive it, then put the notes JSON there.

console.log("Begin NotesData");
import note, { Note } from "../Note.mjs";
import { updateTable } from "./updateTable.mjs";


const preferencesLocalStorageTag = "BibleModel.prefs";
const preferences = JSON.parse(localStorage.getItem(preferencesLocalStorageTag) );
if ( preferences != undefined ) console.log("Note: Preferences read from local storage: ", preferences);

const localStorageTag = "BibleModel.notes";

let localNotesParagraph = document.getElementById('localNotesData');
let localNotesTable = document.getElementById('localNotesTable');
let bibleNotes;

bibleNotes = JSON.parse(localStorage.getItem(localStorageTag));
console.log("bibleNotes=",bibleNotes);

let notesText = JSON.stringify(bibleNotes);
document.getElementById("localNotesData").textContent = notesText;

if ( localNotesData != undefined && notesText.length > 0 ) {
    localNotesParagraph.innerHTML = notesText;
    console.log("bibleNotes JSON text added to the document");
}
if ( localNotesTable != undefined && bibleNotes.length > 0 ) {
// Put the fetched data in the html table of html file.
    updateTable(localNotesTable, bibleNotes);
    console.log("bibleNotes JSON added to the table in the document");
}

function saveAll(notesData) {
    console.log("NotesData: saveAll()");
    // for now, just use LocalStorage
    localStorage.setItem(localStorageTag, JSON.stringify(notesData));
    // TO DO: implement a POST to the notes endpoint


}

// not yet sure when and how to trigger the POST.  TBD
// saveAll(bibleNotes);
