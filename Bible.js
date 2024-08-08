let DataSource = require('./DataSource.js');
let Book = require('./Book.js');
let Location = require('./Location.js');
let Xref           =require('./Xref.js');

class Bible {
    constructor(dataSource) {
        this.books = Book[100];
        this.xrefs = Xref[1000];

    }
}

let theBible = new Bible(DataSource);

Book.load(theBible);
if ( theBible.books != undefined ) {
    console.log('There are ', theBible.books.length, ' books loaded.');
}

Xref.load(theBible);
if ( theBible.xrefs != undefined ) {
    console.log('There are ', theBible.refs.length, ' cross references');
}

console.log('Done.');

module.exports = Bible, theBible;