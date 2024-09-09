//
// Class: Verse
//
// A sequence of words and punctuation usually forming one or more sentences.
//
// Responsibilities:
//      number - the sequence number within the chapter
//      text - the text of the verse.
//
// Collaborators:
//      chapter - the chapter that this verse belongs in.
//      xrefs - one or more cross-references originating with this verse.
//      footnotes - usually one, but possibly more footnotes that pertain to this verse.
//

//- - - - - - - - - - - begin Class definition - - - - - - - - - - -
class Verse {
    constructor() {
        this.number = 0;
        this.text = '';
        this.chapter = undefined;
        this.xrefs = [];
        this.footnotes = [];
    }

    Number(anInteger) {
        this.number = anInteger;
    }
    Number() {
        return this.number;
    }

    Text(someText) {
        this.text = someText;
    }
    Text() {
        return this.text;
    }

    Chapter(aChapter) {
        this.chapter = aChapter;
    }
    Chapter() {
        return this.chapter;
    }

    AddXref(anXref) {
        this.xrefs.push(xref);
    }
    Xrefs() {
        return this.xrefs;
    }

    AddFootnote(aFootnote) {
        this.footnotes.push(aFootnote);
    }
    Footnotes() {
        return this.footnotes;
    }

}
//- - - - - - - - - - - end Class definition - - - - - - - - - - -