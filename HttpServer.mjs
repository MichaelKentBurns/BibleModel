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
            if (urlPath === "/overview"|| urlPath === "/" ) {
                res.end(
'Welcome to the "overview page" of the BibleModel REST server.\n\
Request:\n\
/bible to receive entire Bible current state.\n\
/books to receive list of books.\n\
/bookAbbreviation to receive list of all abbreviated book names.\n\
/book/{name} to receive a specific book.\n\
/book/{name}/contents to receive a specific book and it\'s contents.\n\
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
                const aBook = Book.getBookByName(bookName);
                if (aBook != undefined && aBook != null) {
                    if ( urlArray[3] == 'contents' ) 
                        Book.loadContents(aBook);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(
                    JSON.stringify(aBook) + '\n');
                }
            }
            else if (urlPath === "/bookAbbreviations") {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(
                    JSON.stringify( Book.abbreviationList ) + '\n');
            }
            else if (urlPath === "/stop") {
                res.end("BibleModel REST server stopping.");
                this.stopServer();
            }
            else {
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.end("Page Not Found\n");
            }
        });
        console.log("HttpServer - started.")
        console.log(HttpServer.server);
    }

    static activateServer() {
        HttpServer.server.listen( HttpServer.port, "localhost", () => {
                    console.log( "Listening for request on port ", HttpServer.port );
        });
    }

    static stopServer() {
        console.log("HttpServer being asked to stop.");

                 // Close the server after 10 seconds
                 setTimeout(() => {
                    HttpServer.server.close(() => {
                        console.log('BibleModel REST server on port ',HttpServer.port,' closed successfully');
                    });
                }, 5000);
        console.log("HttpServer should be stopped now.");
    
    }

}
