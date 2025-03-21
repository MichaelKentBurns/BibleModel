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
// RESTendpoint is a simple map of top level URL components to the function to service it.
import { RESTendpoint } from "./RESTendpoint.mjs";

let middlewareGET = (req, res, next) => {
    if ( traceMiddleware ) {
        console.log(`middleware request ${req.method.toUpperCase()} for ${req.url}`);
        console.log(req._header);
    }

    let urlPath = req.url.split('/');
    if ( urlPath[1] == 'Bible' ) {
        if ( urlPath[2] != undefined ) {
        // Check the endpoint registry for a handler.
            let endpoint = RESTendpoint.findEndpoint(req.url.split('/')[2]);
            if ( endpoint !== undefined ) {
                res.setHeader("Access-Control-Allow-Origin","*");
                if (traceMiddleware) console.log("200 Cross Origin accepted");
                RESTendpoint.handleRequest(endpoint, req, res );
                if ( traceMiddleware) {
                    console.log(`middleware response: status=${res.statusCode}`);
                    console.log( res._header );
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
        console.log(req._header);
    }
    let urlPath = req.url.split('?')[0].split('/');
    // Check the endpoint registry for a handler.
    let endpoint = RESTendpoint.findEndpoint(urlPath[2]);
    if (endpoint !== undefined) {
        RESTendpoint.handleRequest(endpoint, req, res);
        if ( traceMiddleware) {
            console.log(`middleware response: status=${res.statusCode}`);
            console.log( res._header );
        }
        return true;
    }
    return false; // not implemented yet.
};

export default {
    middlewarePOST, middlewareGET,
};
