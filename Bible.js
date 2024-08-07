let DataSource = require('./DataSource.js');
let Book = require('./Book.js');
let Location = require('./Location.js');
let Xref           =require('./Xref.js');

Book.load();
let theBooks = Book.books;

Xref.load();
let theXrefs = Xref.xrefs;
console.log('There are ', theXrefs.length, ' cross references');

console.log('Done.');
