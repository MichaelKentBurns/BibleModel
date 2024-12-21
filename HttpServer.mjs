const traceHttpServer = true;

import http from 'node:http';
import { Bible } from "./Bible.mjs";
import { Book } from "./Book.mjs";


export class HttpServer {
    constructor(port) {
        this.port = port;
    }

    static server = undefined;
    static port = 3001;
    static setup() {
        HttpServer.server = http.createServer((req, res) => {
            const urlPath = req.url;
            const urlArray = urlPath.split("/");
            if ( traceHttpServer) console.log("HttpServer: url=" + urlPath);
            if (urlPath === "/overview") {
                res.end(
'Welcome to the "overview page" of the BibleModel REST server.\n\
Request:\n\
/bible to receive entire Bible current state.\n\
/books to receive list of books.\n\
/bookAbbreviation to receive list of all abbreviated book names.\n\
/book/{name} to receive a specific book.\n\
/stop to shut-down this server.'
                        );
            }
            else if (urlPath === "/bible") {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(
                    JSON.stringify( Bible.getBible() ) + '\n');
            }
            else if (urlPath === "/books") {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(
                    JSON.stringify( Bible.getBible().getBooks() ) + '\n');
            }
            else if (urlArray[1] === "book") {
                const bookName = urlArray[2];
                const book = Book.getBookByName(bookName);
                if (book != undefined && book != null) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(
                    JSON.stringify(book) + '\n');
                }
            }
            else if (urlPath === "/bookAbbreviations") {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(
                    JSON.stringify( Book.abbreviationList ) + '\n');
            }
            else if (urlPath === "/stop") {
                res.end("BibleModel REST server stopping.");
                 // Close the server after 10 seconds
                    setTimeout(() => {
                        HttpServer.server.close(() => {
                            console.log('BibleModel REST server on port ',HttpServer.port,' closed successfully');
                        });
                    }, 10000);
            }
            else {
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.end("Page Not Found\n");
            }
        });
    }

    static activateServer() {
        HttpServer.server.listen( HttpServer.port, "localhost", () => {
                    console.log( "Listening for request on port ", HttpServer.port );
        });
    }

}
