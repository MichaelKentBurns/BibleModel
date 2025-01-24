
function fetchBookData() {
    let booksArrayLocal = [];

    const booksJsonPathname = "./books.json";
    let booksText = 'initialized text';
    let booksParagraph = document.getElementById('booksParagraph');
    let booksTable = document.getElementById('booksTable');
    let booksError;
    let enable = true;
    if (enable == true) {
        try {
            console.log('Next step is to fetch books.json file.');
            await fetch(booksJsonPathname,
                {
                    mode: 'no-cors'
                }
            ).then((response) => response.json())
                .then((booksResult) => {
                    console.log("booksJSON=", booksArrayLocal);
                    booksArrayLocal = booksResult;
                    booksText = JSON.stringify(booksArrayLocal);
                });
        } catch (error) {
            console.log("Error trying to fetch books.json: ", error);
            booksError = JSON.stringify(error);
            console.log("Error fetching file ", booksJsonPathname, " : ", booksError);
        }

    } else
        console.log('fetch disabled.');
    return booksArrayLocal;
}

function bookNumberToName(bookNumber) {
   for ( var eachBook of booksArrayLocal ) {
       if (eachBook.bookNumber == bookNumber)
           return eachBook.name;
   }
   return bookNumber;
}