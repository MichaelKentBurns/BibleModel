import DataSource from './DataSource.mjs';
import Book from './Book.mjs';
import Location from './Location.mjs';
import Xref from './Xref.mjs';

locationTest = function() {
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

locationTest();




      
