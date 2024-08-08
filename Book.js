const fs = require('fs')
const DataSource = require('./DataSource.js');
// const Bible = require('./Bible.js');

class Book {
    constructor(row) {
        this.ordinal     = row.order;
        this.name        = row.title_short;
        this.title       = row.title_full;
        this.category    = row.category;
        this.nChapters   = row.chapters;
    }
}

const dataSource = new DataSource();

DataSource.open();

Book.load = function load( theBible ) {
    data.db.serialize(function () {
        data.db.each('SELECT * FROM "book_info"', function (err, row) {
            if (err) console.log(' Error: ', err);
            book = new Book(row);
            let books = theBible.books;
            if (books == undefined) {
                books = [];
                theBible.books = books;
            }
            books.push(book);
            console.log(`Book[${book.ordinal}] ${book.name} loaded.`)
            console.log(book);
        });
    });
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

module.exports = Book;
