const traceXrefs = false;
if ( traceXrefs ) console.log('Xref.js initializing.');

let DataSource = require('./DataSource.js');
// const Bible = require('./Bible.js');
let theBible;

let Location   = require('./Location.js');

class Xref {
    constructor(row) {
        let path;
        this.sourceId               = row.vid;
        this.sourceLoc              = new Location('source', this.sourceId)
        path 			            = this.sourceLoc.path;
        this.sourceBook             = path[0];
        this.sourceChapter          = path[1];
        this.sourceVerse            = path[2];
        this.rank                   = row.rank;
        this.targetId               = row.sv;
        this.targetLoc              = new Location('target', this.targetId);
        path 			            = this.targetLoc.path;
        this.targetBook             = path[0];
        this.targetChapter          = path[0];
        this.targetVerse            = path[0];
        this.targetEndId            = row.ev;
        if ( this.targetEndId != 0)
        {
            this.targetEndLoc       = new Location('targetEnd', this.targetEndId)
            path 	                = this.targetEndLoc.path;
            this.targetEndBook      = path[0];
            this.targetEndChapter   = path[1];
            this.targetEndVerse     = path[2];
        }
        this.type        = 0;
    }
}

Xref.setBible = function ( aBible ) {
    theBible = aBible;
}

let nXrefs = 0;
let announceInterval = 1_000;
Xref.load = function load(aBible) {
    if ( theBible == undefined && aBible != undefined )
        theBible = aBible;
    data = new DataSource();
    DataSource.open();
    let order = 0;
    data.db.serialize(function () {
        data.db.each('SELECT * FROM "cross_reference"', function (err, row) {
            if (err) console.log('XrefLoad: Error: ', err);
            xref = new Xref(row);
            theBible.AddXref(xref);
            if ( traceXrefs ) console.log(xref);
            order ++;
            nXrefs++;
            if ( nXrefs % announceInterval == 0 ) {
                if ( traceXrefs ) console.log('There are now ', nXrefs, ' cross references loaded.');
                announceInterval *= 10;
            }
        });
        if ( theBible != undefined ) theBible.xrefsComplete = true;
        data.db.close();
    });
    if ( theBible != undefined ) {
        if ( theBible.xrefs != undefined )
        {
            if (traceXrefs) console.log(theBible.xrefs);
            if (traceXrefs) console.log('There are a total of ', nXrefs, ' cross references loaded.');
        }
    }
}

if ( theBible != undefined )
    theBible.xrefInitialized = true;
if ( traceXrefs ) console.log('Xref.js initialized.');
    module.exports = Xref;
