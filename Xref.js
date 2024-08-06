let DataSource = require('./DataSource.js');

const million = 1_000_000;
const thousand = 1_000;

function idToBPath(id) {
   	millions =  Math.trunc( id / million );
        thousands = Math.trunc(  ( id % million ) / thousand );
        units = Math.trunc( id % thousand );
        path = [];
	path[0] = millions;
	path[1] = thousands;
	path[2] = units;
	return path;
}

class Xref {
    constructor(row) {
        this.sourceId               = row.vid;
        path 			= idToBPath(this.sourceId);
        this.sourceBook             = path[0];
        this.sourceChapter          = path[1];
        this.sourceVerse            = path[2];
        this.rank                   = row.rank;
        this.targetId               = row.sv;
        path 			= idToBPath(this.targetId);
        this.targetBook             = path[0];
        this.targetChapter          = path[0];
        this.targetVerse            = path[0];
        this.targetEndId            = row.ev;
        if ( this.targetEndId != 0)
        {
            path 	       = idToBPath(this.targetEndId);
            this.targetEndBook      = path[0];
            this.targetEndChapter   = path[1];
            this.targetEndVerse     = path[2];
        }
        this.type        = 0;
    }
}

var xrefs   = [];

data = new DataSource();

DataSource.open();
let nXrefs = 0;
let announceInterval = 1_000;
Xref.load = function load() {
    let order = 0;
    data.db.serialize(function () {
        data.db.each('SELECT * FROM "cross_reference"', function (err, row) {
            if (err) console.log(' Error: ', err);
            xref = new Xref(row);
            xrefs[order] = xref;
            order ++;
            nXrefs++;
            if ( nXrefs % announceInterval == 0 ) {
                console.log('There are now ', nXrefs, ' cross references loaded.');
                announceInterval *= 10;
            }
        });
    });
    console.log('There are a total of ', nXrefs, ' cross references loaded.');
}

Xref.xrefs = function xrefs() {
    return xrefs;
}

module.exports = Xref;
