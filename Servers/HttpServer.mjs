import RESTendpoint from "./RESTServer/RESTendpoint.mjs";

const traceHttpServer = true;

import http from 'node:http';
import { Bible } from "../Bible.mjs";
import { Book } from "../Book.mjs";
import { Version } from "../Version.mjs";
import { Note } from "../Note.mjs";

const BODY_MAX_SIZE = 1024 * 1024;

// parse a body for a post request
let parseBody = (req, res, next) => {
    let bodyStr = '';
    req.body = {};
    req.on('data', function (chunk) {
        bodyStr += chunk.toString();
        // do some basic sanitation
        if (bodyStr.length >= BODY_MAX_SIZE) {
            // if body char length is greater than
            // or equal to 200 destroy the connection
            res.connection.destroy();
        }
    });
    // once the body is received
    req.on('end', function () {
        try{
            req.body = JSON.parse(bodyStr);
        }catch(e){
            req.body = bodyStr;
        }
        next(req, res);
    });
};

// default middleware that does nothing
let middleware = function(req, res, next){
    next(req, res);
};

let forRequest = {};
let useMiddleware = false;
// for any post request
forRequest.POST = (req, res) => {
    // parse the given body
    parseBody(req, res, function(req, res){
        res.resObj = {
            body: req.body,
            mess: ''
        };
        // call middleware
        if ( useMiddleware )
        middleware(req, res, function(req, res){
            // when done send a response
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            // send back this object as a response
            res.write(JSON.stringify(res.resObj), 'utf8');
            res.end();
        });
    });
};


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
            const body = req.body;

            if ( traceHttpServer) console.log(`HttpServer: url=${urlPath} method=${method}`);
            if ( method === "OPTIONS" )
            {
                if ( headers.origin != null ) // === 'https://Bible.MichaelKentBurns.com')
                {
                    res.setHeader("Access-Control-Allow-Origin","*");
                    if (traceHttpServer) console.log("200 Cross Origin accepted");
                    method = "GET";
                }
            }
             if ( method === "GET" ) {
                 // Still trying to get CORS to work.   Send this with every response.
                 res.setHeader("Access-Control-Allow-Origin","*");
                 if (traceHttpServer) console.log("200 Cross Origin accepted");
                 // Check the endpoint registry for a handler.
                 let endpoint = RESTendpoint.findEndpoint(req.url.split('/')[1]);
                 if ( endpoint !== null ) {
                     RESTendpoint.handleRequest(endpoint, req, res );
                 }

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
                } else if (urlArray[1] === "preferences") {
                    res.setHeader("Content-Type","application/json");
                    res.writeHead(200, responseHeaders);
                    res.end(
                        JSON.stringify(Bible.getBible().config) + '\n');
                } else if (urlArray[1] === "versions") {
                    res.setHeader("Content-Type","application/json");
                    res.writeHead(200, responseHeaders);
                    res.end(
                        JSON.stringify(Version.getVersions()) + '\n');
                } else if (urlArray[1] === "bible") {
                    res.setHeader("Content-Type","application/json");
                    res.writeHead(200, responseHeaders);
                    res.end(
                        JSON.stringify(Bible.getBible()) + '\n');
                } else if (urlArray[1] === "books") {
                    res.setHeader("Content-Type","application/json");
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
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(200, responseHeaders);
                        if (traceHttpServer) console.log("document=", returnText, " headers=", responseHeaders);
                        res.end(returnText + '\n');
                    }
                } else if (urlArray[1] === "notes") {
                 res.setHeader("Content-Type","application/json");
                 res.writeHead(200,responseHeaders);
                 let notes = Note.getNotes();
                 if ( urlArray[2] === 'load' ) {
                     Note.loadAll();
                    notes = Note.getNotes();
                 }
                 let notesText = JSON.stringify(notes);
                 res.end(notesText);
                } else if (urlArray[1] === "stop") {
                    res.end("BibleModel REST server stopping.");
                    this.stopServer();
                } else {
                    res.writeHead(404, {"Content-Type": "text/plain"});
                    res.end("Page Not Found\n");
                    if (traceHttpServer) console.log("404 Page Not Found");
                }
            }
            else if ( method === "POST" ) {
                 if (urlArray[1] === "notes") {
                     forRequest.POST(req,res);
                     let body = req.body;
                     if ( body.length ) {
                         Note.setNotes(body);
                         res.writeHead(200, {"Content-Type": "text/plain"});
                         res.end("POST data accepted.\n");
                         if ( urlArray[2] === 'save' )
                             Note.saveAll();
                     } else {
                         res.writeHead(404, {"Content-Type": "text/plain"});
                         res.end("Empty POST data\n");
                     }
                 }
                 else  console.log("UNSUPPORTED POST");
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
