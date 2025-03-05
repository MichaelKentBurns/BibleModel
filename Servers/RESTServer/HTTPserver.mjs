/*
 *  HTTPserver.mjs
 *
 *   This just provides a simple static HTTPserver for the project.
 *   This is a copy of the original HTTPserver, but is being converted to .mjs standards.
 *
 *   ex: $ node HTTPserver ./ 8080
 *
 */
let traceHTTP = true;
import http from 'node:http';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
const lstat = util.promisify(fs.lstat);
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

// THE MAX BODY SIZE
let BODY_MAX_SIZE = 1024;

// __dirname and __filename not supported in ES modules.
// workaround:
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);
console.log(__filename);
// workaround end.

// the root folder of the project
let dir_root = process.argv[2] || path.join(__dirname, '../..');

// try to set up middelware
let middlewarePOST;
let middlewareGET;

import middleware from './middlewareREST.mjs';
try{
    console.log('middleware index found.', middleware);
    middlewarePOST = middleware.middlewarePOST;
    console.log('middlewarePOST = ', middlewarePOST);
    middlewareGET = middleware.middlewareGET;
    console.log('middlewareGET = ', middlewareGET);

}catch(e){
    console.log('no /middleware/middlewareREST.mjs found.');
    console.log(e.message);
}

if ( middlewarePOST === undefined ) {
// default middleware that does nothing
    middlewarePOST = function(req, res, next){
        next(req, res);
    };
}
if ( middlewareGET === undefined ) {
// default middleware that does nothing
    middlewareGET = function(req, res, next){
        next(req, res);
    };
}

// folder containing the Node project.
export let dir_project = process.argv[3] || path.join(__dirname, '../..');
// public folder to serve
//    Public should be a sibling to the project directory.
export let dir_public = path.join(dir_project,'../Public');

// set port with argument or hard coded default
export let port = process.argv[4] || 8082; // port 8888 for now

// host defaults to os.networkInterfaces().lo[0].address
let netInter = os.networkInterfaces(), 
host = process.argv[5] || 'localhost';
if(netInter.lo){
    host = process.argv[5] || netInter.lo[0].address || 'localhost';
}

// create path info object
let createPathInfoObject = (url) => {
    // remove any extra / ( /foo/bar/  to /foo/bar )
    let urlArr = url.split('');
    if(urlArr[urlArr.length - 1] === '/'){
        urlArr.pop();
        url = urlArr.join('');
    }  
    // starting state
    let pInfo = {
        url : url,
        uri : path.join(dir_public, url),
        encoding: 'utf-8',
        mime: 'text/plain',
        ext: '',
        contents: [],
        html: ''
    };
    //return pInfo;
    return lstat(pInfo.uri)
    .then((stat)=>{
        pInfo.stat = stat;
        if(pInfo.stat.isFile()){
            pInfo.ext = path.extname(pInfo.uri).toLowerCase();
            pInfo.ext = path.extname(pInfo.uri).toLowerCase();
            pInfo.mime = pInfo.ext === '.html' ? 'text/html' : pInfo.mime;
            pInfo.mime = pInfo.ext === '.css' ? 'text/css' : pInfo.mime;
            pInfo.mime = pInfo.ext === '.js' ? 'text/javascript' : pInfo.mime;
            pInfo.mime = pInfo.ext === '.mjs' ? 'text/javascript' : pInfo.mime;
            pInfo.mime = pInfo.ext === '.json' ? 'application/json' : pInfo.mime;
             // images
            pInfo.mime = pInfo.ext === '.png' ? 'image/png' : pInfo.mime;
            pInfo.mime = pInfo.ext === '.ico' ? 'image/x-icon' : pInfo.mime;
            // binary encoding if...
            pInfo.encoding = pInfo.ext === '.png' || pInfo.ext === '.ico' ? 'binary' : pInfo.encoding;
            return pInfo;
        }
        if(pInfo.stat.isDirectory()){
            pInfo.ext = '';
            pInfo.mime = 'text/plain';
            pInfo.encoding = 'utf-8';
        }
        return createDirInfo(pInfo);
    });
};

// create an html index of a folder
let createHTML = (pInfo) => {
    var html = '<html><head><title>Index of - ' + pInfo.url + '</title>'+
    '<style>body{padding:20px;background:#afafaf;font-family:arial;}div{display: inline-block;padding:10px;}</style>' +
    '</head><body>';
    html += '<h3>Contents of : ' + pInfo.url + '</h3>'
    pInfo.contents.forEach((itemName)=>{
        let itemURL = pInfo.url + '/' + itemName;
        html += '<div> <a href=\"' + itemURL + '\" >' +  itemName + '</a> </div>'
    });
    html += '</body></html>';
    return html;
};

// create dir info for a pInfo object
let createDirInfo = (pInfo) => {
    // first check for an index.html
    let uriIndex = path.join( pInfo.uri, 'index.html' );
    return readFile(uriIndex)
    // if all goes file we have an index file call createPathInfoObject with new uri
    .then((file)=>{
        pInfo.uri = uriIndex;
        pInfo.ext = '.html';
        pInfo.mime = 'text/html';
        return pInfo;
    })
    // else we do not get contents
    .catch(()=>{
        return readdir(pInfo.uri);
    }).then((contents)=>{
        if(contents && pInfo.ext === ''){
            pInfo.contents = contents;
            pInfo.mime = 'text/html';
            pInfo.html = createHTML(pInfo);
        }
        return pInfo;
    });
};

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

// service statistics
let requestCount = 0;

// create HTTPserver object
let HTTPserver = http.createServer();


let forRequest = {};

// for ALL GET requests
forRequest.GET = (req, res) => {
    // see if the middleware implements the request.

    let done = middlewareGET(req, res );

    if (!done) {
    // create path info object for req.url
    createPathInfoObject(req.url)
    // if we have a pinfo object without any problems
    .then((pInfo)=>{
        // if we have html send that
        if(pInfo.html != ''){
            res.writeHead(200, {
                'Content-Type': pInfo.mime
            });
            res.write(pInfo.html, pInfo.encoding);
            res.end();
        }else{
            // else we are sending a file
            readFile(pInfo.uri, pInfo.encoding).then((file)=>{
                res.writeHead(200, {
                    'Content-Type': pInfo.mime
                });
                res.write(file, pInfo.encoding);
                res.end();
            }).catch((e)=>{
                // send content
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.write(e.message, 'utf8');
                res.end();
            });
        }
    }).catch((e)=>{
        // send content
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.write(e.message, 'utf8');
        res.end();
    });
    if ( traceHTTP ) {
        console.log(`middleware response: status=${res.statusCode}`);
        console.log( res._header );
    }

    }
};

// for any post request
forRequest.POST = (req, res) => {
    // parse the given body
    parseBody(req, res, function(req, res){
        res.resObj = {
           body: req.body,
           mess: ''
        };
        // call middleware
        middlewarePOST(req, res, function(req, res){
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

// on request
HTTPserver.on('request', (req, res)=>{
    requestCount++;
    // call method for request method
    if ( traceHTTP ) {
        console.log(`HTTP server request ${req.method.toUpperCase()} for ${req.url}`);
        console.log(req._header);
    }

        var method = forRequest[req.method];
    if(method){
        method.call(this, req, res);
    }else{
        console.log('unsupported http method ' + req.method);
        // send content
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.write('unsupported http method ' + req.method, 'utf8');
        res.end();
    }
    if ( traceHTTP ) {
        console.log(`HTTP server response: status=${res.statusCode}`);
        console.log( res._header );

    }
});

export function HTTPserverRequestCount() {
   return requestCount;
}

export function HTTPserverSetPort(aPort) {
    port = aPort;
}

export function HTTPserverGetPort() {
    return port;
}
export function HTTPserverStart() {
    console.log('HTTP server started');
}

// start HTTPserver
HTTPserver.listen(port, host, () => {
    console.log('HTTPserver is up: ');
    console.log('dir_root: ' + dir_root);
    console.log('dir_project: ' + dir_project);
    console.log('dir_public: ' + dir_public);
    console.log('port: ' + port);
    console.log('host: ' + host);
});

export function HTTPserverStop () {
    HTTPserver.close();
    console.log('HTTP server stopped');
}

export default {
    server: HTTPserver, HTTPserverStart, HTTPserverSetPort, HTTPserverGetPort,
                        HTTPserverStop, HTTPserverRequestCount,
};
