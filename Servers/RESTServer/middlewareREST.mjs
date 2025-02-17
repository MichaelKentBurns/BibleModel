import { RESTendpoint } from "./RESTendpoint.mjs";

// import http from 'node:http';
// import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
const lstat = util.promisify(fs.lstat);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);

// __dirname and __filename not supported in ES modules.
// workaround:
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);
console.log(__filename);
// workaround end.

// the public folder
let dir_public = path.join(__dirname, '../../../../Public'),
// path to the map.json file
    uri_map = path.join( dir_public, 'map.json' );

// create new map object helper
let createNewMap = () => {
    let map = { cells:[], w: 8, h: 8 };
    let i = 0, cell, len = map.w * map.h;
    while(i < len){
        cell = {
            i : i,
            x: i % map.w,
            y: Math.floor(i / map.w),
            typeIndex: 0
        };
        map.cells.push(cell);
        i += 1;
    }
    // start off map cell 0 with type index 1
    map.cells[0].typeIndex = 1;
    return map;
};

let updateMap = (map, body) => {
    if(body.action === 'setCellType'){
        var cellIndex = body.cellIndex,
            typeIndex = body.typeIndex;
        map.cells[cellIndex].typeIndex = typeIndex;
    }
};

let middlewareGET = (req, res, next) => {
    let urlPath = req.url.split('/');
    if ( urlPath[1] == 'Bible' ) {
        if ( urlPath[2] == undefined || urlPath[2].length == 0 ) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
        } else {
        // Check the endpoint registry for a handler.
            let endpoint = RESTendpoint.findEndpoint(req.url.split('/')[2]);
            if ( endpoint !== undefined ) {
                RESTendpoint.handleRequest(endpoint, req, res );
                return true;
            }
            return false;
        }
        return false;  // specific path not implemented.
    }
    return false; // not implemented yet.
};

let middlewarePOST = (req, res, next) => {
    let urlPath = req.url.split('/');
    if ( urlPath[1] == 'Bible' ) {
        if ( urlPath[2] == undefined || urlPath[2].length == 0 ) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
        } else {
            // Check the endpoint registry for a handler.
            let endpoint = RESTendpoint.findEndpoint(req.url.split('/')[2]);
            if ( endpoint !== undefined ) {
                RESTendpoint.handleRequest(endpoint, req, res );
                return true;
            }
            return false;
        }
        return false;  // specific path not implemented.
    }
    return false; // not implemented yet.
};

export default {
    middlewarePOST, middlewareGET,
};
