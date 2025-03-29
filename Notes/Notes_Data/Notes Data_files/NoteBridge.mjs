import {Note} from "../Note.mjs";

const noteClass = Note;
const aNote = new Note();
const noteCastMany = function noteCastMany( noteLikeList ) { return Note.castMany(noteLikeList)};
const noteCast = function noteCast( noteLikeObject ) { return Note.cast(noteLikeObject)};
