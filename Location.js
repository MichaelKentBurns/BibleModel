
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

module.exports = Location, Passage;


      
