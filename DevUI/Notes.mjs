import {Note} from "../Note.mjs";
// import { RestClient2 } from "./RestClient2.js";

const preferencesLocalStorageTag = "BibleModel.prefs";
const preferences = JSON.parse(localStorage.getItem(preferencesLocalStorageTag));
if (preferences != undefined) console.log("Note: Preferences read from local storage: ", preferences);

// isUpdate and possibly others were never appropriately initialized.
let isUpdate = false;

// items that were string literals in multiple places that really should match.
const localStorageTag = "BibleModel.notes";
let bibleNotes = [Note];

const addBox = document.querySelector(".add-box");
const popUpBox = document.querySelector(".popup-box");
const closeIcon = document.querySelector("header i");
const titleTag = document.querySelector("input");
const descTag = document.querySelector("textarea");
const addBtn = popUpBox.querySelector("button");
const popupTitle = document.querySelector("header p");

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

addBox.addEventListener("click", function () {
    console.log("add listener clicked.")
    titleTag.focus();
    popUpBox.classList.add("show")
});


closeIcon.addEventListener("click", () => {
    console.log("close listener clicked.")

    popUpBox.classList.remove("show")
});


addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let noteTitle = titleTag.value,
        noteDesc = descTag.value;
    if (noteTitle || noteDesc) {

        let aNote = new Note();
        aNote.widget = this;
        aNote.setText(noteDesc);
        aNote.setTitle(noteTitle);
        aNote.setAuthor(preferences.OwnerInitials);

        let dateObj = new Date(),
            month = months[dateObj.getMonth()],
            day = dateObj.getDate(),
            year = dateObj.getFullYear();

        if (aNote.Created == null)
            aNote.Created = dateObj;
        aNote.Modified = dateObj;

        let noteInfo = {
            title: noteTitle,
            description: noteDesc,
            date: `${month} ${day} ${year}`
        }

        if (!isUpdate) {
            bibleNotes.push(aNote);
        } else {
            isUpdate = false;
            bibleNotes[UpdateId] = aNote;
        }
        localStorage.setItem(localStorageTag, JSON.stringify(bibleNotes));
        closeIcon.click()
        showNotes()
    }
});

function showNotes() {
    document.querySelectorAll(".note").forEach(note => note.remove())
    bibleNotes.forEach((note, index) => {

        console.log(`Preparing to display note[${index}]`);
        if (note != null) {

            let liTag = `  <li class="note">
      <div class="details">
          <p>${note.title}</p>
          <span>${note.text}</span>
      </div>
      <div class="bottom-content">
          <span>${note.modified}</span>
          <div class="settings">
            <i onclick="showMenu(note.widget)" class="uil uil-ellipsis-h">...</i>
            <ul class="menu">
                <li onclick="updateNote(${index}, '${note.title}', '${note.text}')">
                        <i class="uil uil-pen"></i>Edit</li>
                <li onclick="deleteNote(${index})">
                        <i class="uil uil-trash"></i>Delete</li>
            </ul>
        </div>
      </div>
     </li>`;
            note.widget = liTag;
            addBox.insertAdjacentHTML("afterend", liTag)
        }
    });

};


bibleNotes
    // [Note]
    = JSON.parse(localStorage.getItem(localStorageTag) || "[]");
console.log("bibleNotes=", bibleNotes);
showNotes();   // display the existing notes just fetched.

closeIcon.addEventListener("click", () => {
    titleTag.value = "";
    descTag.value = "";
});

function showMenu(elem) {
    console.log("showMenu.")

    elem.parentElement.classList.add("show")
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show")
        }
    });
}

function deleteNote(noteId) {
    console.log(`delete note ${noteId} .`);

    let confirmDel = confirm("Are you sure you want to delete this item?");
    if (!confirmDel) return;

    bibleNotes.splice(noteId, 1);
    localStorage.setItem(localStorageTag, JSON.stringify(bibleNotes));
    showNotes();
}

function updateNote(noteId, title, desc) {
    console.log(`delete note ${noteId} .`);
    isUpdate = true;
    let updateId = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = "Update Note";
    popupTitle.innerText = "Update a Note";
}

closeIcon.addEventListener("click", () => {
    console.log(`Edit note close button clicked.`);
    titleTag.value = "";
    descTag.value = "";
});
