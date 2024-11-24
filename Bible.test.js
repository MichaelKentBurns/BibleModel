
const Bible = require('./Bible');
const  theBible = new Bible();

theBible.loadAll();

test('Starts Bible and see if books are loaded', () => {
	expect(theBible.books)
	expect(theBible.books != undefined )
	theBible.loadAll();
	expect(theBible.promiseToLoadBooks)
	expect(theBible.booksComplete)

});
