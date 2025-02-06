import { Note } from "./Note.mjs";
import { RestClient2 } from "./RestClient2.js";

// let prefsData = RestClient2.callRestClient("/preferences");
let prefsPromise;  // not used currently.
const preferencesLocalStorageTag = "BibleModel.prefs";
const preferences = JSON.parse(localStorage.getItem(preferencesLocalStorageTag) );
if ( preferences != undefined ) console.log("Note: Preferences read from local storage: ", preferences);

let notesList;

// isUpdate and possibly others were never appropriately initialized.
let isUpdate = false;

// items that were string literals in multiple places that really should match.
const localStorageTag = "BibleModel.notes";
let bibleNotes = [Note];

const addBox = document.querySelector(".add-box");
const popUpBox = document.querySelector(".popup-box");
const closeIcon = document.querySelector("header i");
const titleTag= document.querySelector("input");
const descTag= document.querySelector("textarea");
const addBtn = popUpBox.querySelector("button");
const popupTitle = document.querySelector("header p");

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

addBox.addEventListener("click", function(){
    titleTag.focus();
    popUpBox.classList.add("show")
});


closeIcon.addEventListener("click", ()=>{
    popUpBox.classList.remove("show")
});


addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let noteTitle = titleTag.value,
        noteDesc = descTag.value;
    if (noteTitle || noteDesc){

        let aNote = new Note();
        aNote.setText(noteDesc);
        aNote.setTitle(noteTitle);
     //   aNote.setAuthor(prefs.Owner);

        let dateObj = new Date(),
            month = months[dateObj.getMonth()],
            day = dateObj.getDate(),
            year = dateObj.getFullYear();


        let noteInfo = {
            title: noteTitle, description: noteDesc,
            date: `${month} ${day} ${year}`
        }
        if(!isUpdate){
            notes.push(noteInfo);
            bibleNotes.push(aNote);
        }else {
            isUpdate = false;
            notes[UpdateId] = noteInfo
            bibleNotes[UpdateId] = noteInfo;
        }
        localStorage.setItem(localStorageTag, JSON.stringify(notes));
        closeIcon.click()
        showNotes()
    }
});

const notes = JSON.parse(localStorage.getItem(localStorageTag) || "[]");

function showNotes() {
    document.querySelectorAll(".note").forEach(note => note.remove())
    notes.forEach((note, index) => {
        let liTag = `  <li class="note">
      <div class="details">
          <p>${note.title}</p>
          <span>${note.description}</span>
      </div>
      <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i onclick="showMenu(this)" class="uil uil-ellipsis-h">...</i>
            <ul class="menu">
                <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
                <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
            </ul>
        </div>
      </div>
     </li>`;
        addBox.insertAdjacentHTML("afterend", liTag)
    });
};

//prefsPromise.then((response) => {
//    console.log(response);
//    console.log(response.statusText)
//    let responseData = response.json(response);
//    let responseText = JSON.stringify(responseData);
//    notesList = responseData;
//    showNotes();
//});
//    .then((versionsResult) => {
//        responseData = versionsResult;
//        responseText = JSON.stringify(responseText);
//    });

// showNotes();

// after callRestClient has been called and it gets to await,  the server sees request and control comes here.
closeIcon.addEventListener("click", ()=>{
    titleTag.value = "";
    descTag.value = "";
});

function showMenu(elem){
    elem.parentElement.classList.add("show")
    document.addEventListener("click", e =>{
        if(e.target.tagName != "I" || e.target != elem){
            elem.parentElement.classList.remove("show")
        }
    });
}

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this item?");
    if (!confirmDel) return;

    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, desc) {
    isUpdate = true;
    let updateId = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = "Update Note";
    popupTitle.innerText = "Update a Note";
}

closeIcon.addEventListener("click", ()=>{
    titleTag.value = "";
    descTag.value = "";
});


// when the previous 5 calls execute, control from here goes to the .then in RestClient.mjs ???
