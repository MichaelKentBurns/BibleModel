let DataSource = require('./DataSource.js');

class Book {
    constructor(row) {
        this.ordinal     = row.order;
        this.name        = row.title_short;
        this.title       = row.title_full;
        this.category    = row.category;
        this.nChapters   = row.chapters;
    }
}

var books   = [];

data = new DataSource();

DataSource.open();

Book.load = function load() {
    data.db.serialize(function () {
        data.db.each('SELECT * FROM "book_info"', function (err, row) {
            if (err) console.log(' Error: ', err);
            book = new Book(row);
            books[book.order] = book;
            console.log(`Book[${book.ordinal}] ${book.name} loaded.`)
        });
    });
    console.log(books);
}

Book.books = function books() {
    return books;
}

module.exports = Book;
