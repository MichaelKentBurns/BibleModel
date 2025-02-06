const traceHttpServer = true;

import http from 'node:http';
import { Bible } from "./Bible.mjs";
import { Book } from "./Book.mjs";
import { Version } from "./Version.mjs";


export class HttpServer {
    constructor(port) {
        this.port = port;
    }

    static server = undefined;
    static port = 3001;
    static setup() {
        HttpServer.server = http.createServer((req, res) => {
            const urlPath = req.url;
            let method = req.method;
            const headers = req.headers;
            const urlArray = urlPath.split("/");
            const responseHeaders = new Headers();
            if ( traceHttpServer) console.log(`HttpServer: url=${urlPath} method=${method}`);
            if ( method === "OPTIONS" )
            {
                if ( headers.origin != null ) // === 'https://Bible.MichaelKentBurns.com')
                {
                    responseHeaders.append("Access-Control-Allow-Origin","*");
                    if (traceHttpServer) console.log("200 Cross Origin accepted");
                    method = "GET";
                }
            }
             if ( method === "GET" ) {
                if (urlPath === "/overview" || urlPath === "/") {
                    res.end(
                        'Welcome to the "overview page" of the BibleModel REST server.\n\
                        Request:\n\
                        /preferences to receive the current preferences.\n\
                        /versions to receive the list of Bible versions.\n\
                        /bible to receive entire Bible current state.\n\
                        /books to receive list of books.\n\
                        /bookAbbreviation to receive list of all abbreviated book names.\n\
                        /book/{name} to receive a specific book.\n\
                        /book/{name}/contents to receive a specific book and it\'s contents.\n\
                        /stop to shut-down this server.'
                    );
                } else if (urlPath === "/preferences") {
                    responseHeaders.append("Content-Type","application/json");
                    res.writeHead(200, responseHeaders);
                    res.end(
                        JSON.stringify(Bible.getBible().config) + '\n');
                } else if (urlPath === "/versions") {
                    responseHeaders.append("Content-Type","application/json");
                    res.writeHead(200, responseHeaders);
                    res.end(
                        JSON.stringify(Version.getVersions()) + '\n');
                } else if (urlPath === "/bible") {
                    responseHeaders.append("Content-Type","application/json");
                    res.writeHead(200, responseHeaders);
                    res.end(
                        JSON.stringify(Bible.getBible()) + '\n');
                } else if (urlPath === "/books") {
                    responseHeaders.append("Content-Type","application/json");
                    res.writeHead(200, responseHeaders);
                    res.end(
                        JSON.stringify(Bible.getBible().getBooks()) + '\n');
                } else if (urlArray[1] === "book") {
                    const bookName = urlArray[2];
                    const aBook = Book.getBookByName(bookName);
                    if (traceHttpServer) console.log("bookName=", bookName, " aBook=", aBook);
                    if (aBook != undefined && aBook != null) {
                        if (urlArray[3] == 'contents')
                            Book.loadContents(aBook);
                        let returnText = JSON.stringify(aBook)
                        responseHeaders.append("Content-Type","application/json");
                        res.writeHead(200, responseHeaders);
                        if (traceHttpServer) console.log("document=", returnText, " headers=", responseHeaders);
                        res.end(returnText + '\n');
                    }
                } else if (urlPath === "/bookAbbreviations") {
                    responseHeaders.append("Content-Type","application/json");
                    res.writeHead(200,responseHeaders);
                    res.end(
                        JSON.stringify(Book.abbreviationList) + '\n');
                } else if (urlPath === "/stop") {
                    res.end("BibleModel REST server stopping.");
                    this.stopServer();
                } else {
                    res.writeHead(404, {"Content-Type": "text/plain"});
                    res.end("Page Not Found\n");
                    if (traceHttpServer) console.log("404 Page Not Found");
                }
            }
            else if ( method === "POST" ) {
                console.log("UNSUPPORTED POST");
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
