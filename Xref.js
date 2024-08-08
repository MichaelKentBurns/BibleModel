let DataSource = require('./DataSource.js');
// const Bible = require('./Bible.js');
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

data = new DataSource();

let nXrefs = 0;
let announceInterval = 1_000;
Xref.load = function load(theBible) {
    DataSource.open();
    let order = 0;
    data.db.serialize(function () {
        data.db.each('SELECT * FROM "cross_reference"', function (err, row) {
            if (err) console.log(' Error: ', err);
            xref = new Xref(row);
            if ( theBible != undefined ) {
                if ( theBible.xrefs == undefined)
                    theBible.xrefs = Xref[1000];
                theBible.xrefs .push(xref);
            }
            // console.log(xref);
            order ++;
            nXrefs++;
            if ( nXrefs % announceInterval == 0 ) {
                console.log('There are now ', nXrefs, ' cross references loaded.');
                announceInterval *= 10;
            }
        });
    });
    if ( theBible != undefined && theBible.xrefs != undefined ) {
        console.log(theBible.xrefs);
        console.log('There are a total of ', nXrefs, ' cross references loaded.');
    }
}

module.exports = Xref;
