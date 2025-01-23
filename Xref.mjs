const traceXrefs = false;
if (traceXrefs) console.log('Xref.mjs initializing.');

import {DataSource} from './DataSource.mjs';
// import  { Bible } from './Bible.mjs';
import  { Book } from './Book.mjs';
// import  { Chapter } from './Chapter.mjs';

let theBible;

import {Location} from './Location.mjs';

let nXrefs = 0;
let announceInterval = 1_000;

export class Xref {

    constructor(row) {
        let path;
        this.xrefNumber = 0;
        this.sourceId = row.vid;
        this.sourceLoc = new Location('source', this.sourceId)
        path = this.sourceLoc.path;
        this.sourceBook = path[0];
        this.sourceChapter = path[1];
        this.sourceVerse = path[2];
        this.rank = row.rank;
        this.targetId = row.sv;
        this.targetLoc = new Location('target', this.targetId);
        path = this.targetLoc.path;
        this.targetBook = path[0];
        this.targetChapter = path[1];
        this.targetVerse = path[2];
        this.targetEndId = row.ev;
        if (this.targetEndId != 0) {
            this.targetEndLoc = new Location('targetEnd', this.targetEndId)
            path = this.targetEndLoc.path;
            this.targetEndBook = path[0];
            this.targetEndChapter = path[1];
            this.targetEndVerse = path[2];
        }
        this.type = 0;
    }

    static setBible(aBible) {
        theBible = aBible;
    }

    static loadAll(aBible) {
        let databaseError = undefined;

        if (theBible == undefined && aBible != undefined)
            theBible = aBible;
        let dSource = aBible.dSource;
        if (dSource === undefined)
            dSource = Book.theBible.dSource;
        try {
            let newXrefs = [Xref];
            const sql = 'SELECT * FROM cross_reference';
            const query = dSource.prepare(sql);
            if (traceXrefs) console.log("Database query '", sql, "'. prepared. Query=", query);
            const xrows = query.all();
            let order = 0;
            let lastBookNumber = 0;  // detect changes from one book to another
            let thisBookNumber = 0;  // book number currently source of xrefs
            let currentBook;         // current book for this xref
            xrows.forEach((xrow) => {
                let xref = new Xref(xrow);
                newXrefs.push(xref);
                theBible.addXref(xref);
                if (traceXrefs) console.log(xref);
                order++;

                nXrefs++;
                let xrefNumber = nXrefs;
                xref.xrefNumber = xrefNumber;
                if ( xref.sourceBook > lastBookNumber) {  // first xref of a new book
                    thisBookNumber = xref.sourceBook;
                    currentBook = Book.getBookByNumber(thisBookNumber);
                    currentBook.firstXref = xrefNumber;
                }
                if ( currentBook && currentBook.bookNumber == xref.sourceBook )
                    currentBook.lastXref = xrefNumber;
                lastBookNumber = thisBookNumber;  // remember across iterations
                if (nXrefs % announceInterval == 0) {
                    if (traceXrefs) console.log('There are now ', nXrefs, ' cross references loaded.');
                    announceInterval *= 10;
                }
            });
        } catch (error) {
            databaseError = error;
            if (traceXrefs) console.log("Xrefs ERROR: encountered reading cross references from database.", error);
        }
        if (theBible != undefined) theBible.xrefsComplete = true;
    }
}

export default {Xref};
