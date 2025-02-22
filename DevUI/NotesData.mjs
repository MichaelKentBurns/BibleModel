console.log("Begin NotesData");
import note, { Note } from "../Note.mjs";

const preferencesLocalStorageTag = "BibleModel.prefs";
const preferences = JSON.parse(localStorage.getItem(preferencesLocalStorageTag) );
if ( preferences != undefined ) console.log("Note: Preferences read from local storage: ", preferences);

const localStorageTag = "BibleModel.notes";
let bibleNotes;

bibleNotes = JSON.parse(localStorage.getItem(localStorageTag) || "[]");
console.log("bibleNotes=",bibleNotes);

let notesText = JSON.stringify(bibleNotes);
document.getElementById("notesData").textContent = notesText;

// Put the fetched data in the html table of html file.
updateTable(notesTable,bibleNotes);

function saveAll(notesData) {
    // for now, just use LocalStorage
    localStorage.setItem(localStorageTag, JSON.stringify(notesData));

    // TO DO: implement a POST to the notes endpoint
}

saveAll(bibleNotes);
