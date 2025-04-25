
const million     	 = 1_000_000;
const allVerses      =       999;
const allChapters    =   999_999;
const thousand 	  	 =     1_000;
const bookPathIdx    = 0;
const chapterPathIdx = 1;
const versePathIdx   = 2;

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

export class Location {

    constructor(name,id) {
        this.name 	= name;
        this.id 	= id;
		this.path	= idToBPath(id);
	}

	getId() {
		if (this.id == undefined) {
			this.id = 0;
			if (this.path[0]) this.id += ( this.path[0] * million );
			if (this.path[1]) this.id += ( this.path[1] * thousand );
			if (this.path[2]) this.id += ( this.path[2]  );
		}
		return this.id;
	}

	setBook(bookNumber) {
         this.path[bookPathIdx] = bookNumber;
	}

	setChapter(chapterNumber) {
		this.path[chapterPathIdx] = chapterNumber;
   }

	setVerse(verseNumber) {
		this.path[versePathIdx] = verseNumber;
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

	static referenceToLocation( aString ){
		let stripped = aString.replace( /^\s*/, '' );
		let newLoc = new Location();
        let bookPrefix = "";
		let result = /(\d)/i.exec(stripped);
		if ( result && result.length == 1 )  {
			bookPrefix = result[0];
			stripped = stripped.slice(2).replace( /^\s*/, '' );
		}

		result = /(\w+)\s+(\d+):(\d+)/i.exec(stripped);
		if ( !result ) {
			result = /(\w+)\s+(\d+)/i.exec(stripped);
		}
		if ( !result ) {
			result = /(\w+)/i.exec(stripped);
		}
		if ( result && result.length >= 1 ) {
	        let reference = result[0];
			let bookName = bookPrefix + result[1];
			let chapNumber = 0;
			if ( result.length > 1 )
			    chapNumber = result[2];
			let verseNumber = 0;
			if ( result.length > 2 )
			    verseNumber = result[3];
			let bookNumber = Location.mapBookNameToNumber(bookName);
			let newLoc = Location.mapBookNameToLocation(bookName);
			newLoc.name = reference;
			newLoc.path[0] = bookNumber;
			newLoc.path[1] = chapNumber;
			newLoc.path[2] = verseNumber;
			return newLoc;
		}

		console.log(`input=${aString} bookName=${bookName}`);
		return bookName;
	}

	static registerBookName(bookName, bookNumber){
		Location.bookNameMap.set(bookName, bookNumber);
	}

	static bookNameMap = new Map();

	static registerAllBookNames(bookNamesMap) {
		if (!bookNameMap) {
			let bookNameMapText = localStorage.get("BibleBookNamesMap");
			if ( bookNameMapText ) {
				let bookNameMapArray = JSON.parse(bookNameMapText);
				bookNameMapArray.forEach( bookPair => {
					Location.registerBookName(bookPair[0], bookPair[1]);
				});
			}
		}
	}

	static mapBookNameToNumber( aBookName ) {
		let bookNumber = Location.bookNameMap.get( aBookName );
		return bookNumber;
	}

	static mapBookNameToLocation( aBookName ){
		let bookNumber = Location.bookNameMap.get( aBookName );
		let location = new Location(name, bookNumber);
		return location;
	}
}

export class Passage {

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

export default { Location, Passage };


      
