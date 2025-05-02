// BibleModel/Servers/RESTserver/middlewareREST.mjs
// This middleware is a plugin router for REST requests from the HTTPserver.
// When the HTTPserver gets a request, it first calls this middleware router.
// This router looks at the first component of the URL of the incoming request
// in the RESTendpoint map.   If an entry is found then that endpoint is used
// to call a plugin function to service the REST request.
// If the URL component is NOT found in the map, then this middleware
// simply returns false to the HTTPserver to indicate that it should handle
// the request as a normal HTTPserver request.
let traceMiddleware = true;
let traceMiddlewareFull = false;

// RESTendpoint is a simple map of top level URL components to the function to service it.
import { RESTendpoint } from "./RESTendpoint.mjs";

let middlewareGET = (req, res, next) => {
    let url = req.url;
    let urlPath = req.url.split('/');
    let fromNginx=false;
    req.rawHeaders.forEach( (header) => {
        if ( header === 'nginx' ) {
            fromNginx = true;
        }
    });
    let firstElement = urlPath[1];
    // nginx already removes the 'Bible' first element
    if ( fromNginx ) {
          firstElement = 'Bible';
        } else {
           firstElement = urlPath[1];
           urlPath = urlPath.slice(1);
           console.log( 'not from Nginx, so remove first element. ');
        }
    console.log(`from nginx=${fromNginx}`);
    if ( traceMiddleware ) {
        console.groupCollapsed('middleware request:');
        console.log(`${req.method.toUpperCase()} for ${req.url}`);
        if ( traceMiddlewareFull && res ) console.log(`full: `, req);
        console.log( `headers: ${req._header}` );
        console.log(`headers: `, req.rawHeaders); // ._header);
        console.groupEnd();
    }

    if ( firstElement == 'Bible' ) {
        let secondElement = urlPath[1];
        if ( secondElement != undefined && secondElement.length > 0 ) {
        // Check the endpoint registry for a handler.
            let endpoint = RESTendpoint.findEndpoint(secondElement);
            if ( endpoint !== undefined ) {
                res.setHeader("Access-Control-Allow-Origin","*");
                if (traceMiddleware) console.log("200 Cross Origin accepted");
                RESTendpoint.handleRequest(endpoint, req, res );
                if ( traceMiddleware) {
                    console.groupCollapsed('middleware response:');
                    if ( traceMiddlewareFull && res ) console.log(`response full: `, res);
                    console.log(`status: ${res.statusCode}`);
                    console.log( `headers: ${res._header}` );
                    console.groupEnd();
                }
                return true;
            }
            return false;
        }
        return false;  // specific path not implemented.
    }
    return false; // not implemented yet.
};

let middlewarePOST = (req, res, next) => {

    if ( traceMiddleware ) {
        console.log(`middleware request ${req.method.toUpperCase()} for ${req.url}`);
        console.log(`middleware request `, req.rawHeaders); // ._header);
    }
    let urlPath = req.url.split('?')[0].split('/');
    // Check the endpoint registry for a handler.
    let endpoint = RESTendpoint.findEndpoint(urlPath[2]);
    if (endpoint !== undefined) {
        RESTendpoint.handleRequest(endpoint, req, res);
        if ( traceMiddleware) {
            console.log(`middleware response: status=${res.statusCode}`);
            console.log( `middleware response headers ${res._header}` );
            if ( traceMiddlewareFull ) {
                console.groupCollapsed('middleware response:');
                console.log(`full response: `, res);
                console.groupEnd();
            }
        }
        return true;
    }
    return false; // not implemented yet.
};

let middlewareOPT = (req, res, next) => {
    let url = req.url;
    let urlPath = req.url.split('/');
    let fromNginx=false;
    req.rawHeaders.forEach( (header) => {
        if ( header === 'nginx' ) {
            fromNginx = true;
        }
    });
    let firstElement = urlPath[1];
    // nginx already removes the 'Bible' first element
    if ( fromNginx ) {
        firstElement = 'Bible';
    } else {
        firstElement = urlPath[1];
        urlPath = urlPath.slice(1);
        console.log( 'not from Nginx, so remove first element. ');
    }
    console.log(`from nginx=${fromNginx}`);
    if ( traceMiddleware ) {
        console.groupCollapsed('middleware request:');
        console.log(`${req.method.toUpperCase()} for ${req.url}`);
        if ( traceMiddlewareFull && res ) console.log(`full: `, req);
        console.log( `headers: ${req._header}` );
        console.log(`headers: `, req.rawHeaders); // ._header);
        console.groupEnd();
    }

    if ( firstElement == 'Bible' ) {
        let secondElement = urlPath[1];
        if ( secondElement != undefined && secondElement.length > 0 ) {
            // Check the endpoint registry for a handler.
            let endpoint = RESTendpoint.findEndpoint(secondElement);
            if ( endpoint !== undefined ) {
                res.setHeader("Access-Control-Allow-Origin","*");
                if (traceMiddleware) console.log("200 Cross Origin accepted");
                RESTendpoint.handleRequest(endpoint, req, res );
                if ( traceMiddleware) {
                    console.groupCollapsed('middleware response:');
                    if ( traceMiddlewareFull && res ) console.log(`response full: `, res);
                    console.log(`status: ${res.statusCode}`);
                    console.log( `headers: ${res._header}` );
                    console.groupEnd();
                }
                return true;
            }
            return false;
        }
        return false;  // specific path not implemented.
    }
    return false; // not implemented yet.
};


export default {
    middlewarePOST, middlewareGET, middlewareOPT
};
