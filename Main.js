let theBible;

const DataSource = require('./DataSource.js');
const fs = require('fs');
//------------------------------------------------------------------------------------------
class Bible {
    constructor() {
        this.books = [];
        this.xrefs = [];
    }

    AddBook(book) {
        this.books.push(book);
        console.log('Book added: ' + book.name);
    }

    AddXref(xref) {
        this.xrefs.push(xref);
        console.log('Xref added: ' + xref);
    }

    LoadAll() {

        console.log('Loading books...');
        let row = new Object();
        let protoBook = new Book(row);
        Book.load(theBible);
        if (theBible.books != undefined) {
            console.log('There are ', theBible.books.length, ' books loaded.');
        }

        Book.saveAll(theBible);
        console.log("Books saved.");

        console.log('Loading cross references...');
        Xref.load(theBible);
        if (theBible.xrefs != undefined) {
            console.log('There are ', theBible.xrefs.length, ' cross references');
        }

    }
}


//------------------------------------------------------------------------------------------

const million     	= 1_000_000;
const allVerses     	=       999;
const allChapters   	=   999_999;
const thousand 	  	=     1_000;

function idToBPath(id){
	let millions =  Math.trunc( id / million );
	let thousands = Math.trunc(  ( id % million ) / thousand );
	let units = Math.trunc( id % thousand );
	let path = [];
	path[0] = millions;
	path[1] = thousands;
	path[2] = units;
	return path;
}


class Location {

    constructor(name,id) {
        this.name 	= name;
        this.id 	= id;
		this.path	= idToBPath(id);
	}

	path() {
		return this.path;
	}
	cpath(id){
		let millions =  Math.trunc( id / million );
		let thousands = Math.trunc(  ( id % million ) / thousand );
		let units = Math.trunc( id % thousand );
		let path = [];
		path[0] = millions;
		path[1] = thousands;
		path[2] = units;
		return path;
	}
}


//------------------------------------------------------------------------------------------
class Passage {

    constructor( name, startLoc, endLoc) {
        this.name 	= name;
        this.startId 	= startLoc.id ;
		this.startPath	= idToBPath(startId);
        this.endId 	= endLoc.id;
		this.endPath	= idToBPath(endId);
	}

	name() {
		return this.name;
	}
	startId() {
		return this.startId;
	}
	endId() {
		return this.endId;
	}

	startPath() {
		return this.startPath;
	}
	endPath() {
		return this.endPath;
	}
}

//------------------------------------------------------------------------------------------
Location.locationTest = function() {
	console.log('locationTest start.');
	const Genesis = 1_000_000,
      	Gen_1_1 = 1_001_001,
      	Matthew = 40_000_000,
      	Matt_1_1 = 40_001_001,
      	Matt_28_18 = 40_028_018
      	;
      
	path1 = idToBPath(Genesis);		 console.log('Genesis = ', path1);
	path2 = idToBPath(Matt_28_18);		 console.log('GreatCommission = ', path2);
	
	genesisStart	= Location('Genesis', Genesis);
		console.log('genesisStart: ' + genesisStart );
	genesisEnd   	= Location('Genesis end', Genesis+AllChapters+AllVerses);
		console.log('genesisEnd: ' + genesisEnd );
	genesisAll  	= Passage ('Genesis all', genesisStart, genesisEnd);
		console.log('genesisAll: ' + genesisAll );
	
	console.log('locationTest end.');
       }


//------------------------------------------------------------------------------------------
class Book {
    constructor(row) {
        this.ordinal     = row.order;
        this.name        = row.title_short;
        this.title       = row.title_full;
        this.category    = row.category;
        this.nChapters   = row.chapters;
    }

}
    Book.load = function ( theBible ) {
        data = new DataSource();
        DataSource.open();
let books = [];
        data.db.serialize(function () {
            data.db.each('SELECT * FROM "book_info"', function (err, row) {
                if (err) console.log(' Error: ', err);
                book = new Book(row);
                theBible.AddBook(book);
                books.push(book);
                console.log(`Book[${book.ordinal}] ${book.name} loaded.`)
                console.log(book);
            });
        });
            data.db.close();
            console.log(theBible.books.length + " books loaded.");
            Book.saveAll(theBible);
            console.log("done load and Strange execution timing.txt.");
    }

    Book.saveAll = function (theBible) {

    if ( theBible != undefined && theBible.books != undefined) {
        console.log(theBible.books);

        // convert JSON object to a string
        const jsonData = JSON.stringify(theBible.books)

        // write JSON string to a file
        fs.writeFile('books.json', jsonData, err => {
            if (err) {
                throw err
            }
            console.log('Books JSON data is saved.')
        })

    }

}


let nXrefs = 0;
let announceInterval = 1_000;
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

    Xref.load = function (theBible) {

    DataSource.open();
    let order = 0;
    data.db.serialize(function () {
        data.db.each('SELECT * FROM "cross_reference"', function (err, row) {
            if (err) console.log(' Error: ', err);
            let xref = new Xref(row);
            theBible.AddXref(xref);
            console.log(xref);
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

// Let the real work begin...


theBible = new Bible();
console.log('theBible created.');
theBible.LoadAll();

data.db.close();

console.log('Done.');

