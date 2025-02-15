import {Chapter} from "../../Chapter.mjs";

const traceHttpServer = true;

import http from 'node:http';
import { Bible } from  '../../Bible.mjs';

//mm  # Class:  RESTendpoint
//mm
//mm  A URL fragment that identifies a REST endpoint that can be accessed by the REST server.
//mm
//mm  ### Responsibilities:
//mm  * Maps a path from a URL fragment to the class and method that provides a service.
//mm  * A longer descriptive name.
//mm
//mm  ### Collaborators:
//mm  * The Class that provides the service access to a resource.
//mm  * The method to handle an HTTP request -> response.
//mm
//mm ```mermaid
//mm classDiagram

export class RESTendpoint {

    constructor( endpointPath, handlerClass, requestHandler) {
        //mm +String endpointPath;  // URL path fragment from HTTP URL
        this.endpointPath = endpointPath;
        //mm +Class  handlerClass;  // Name of the class that handles the request
        this.handlerClass = handlerClass;
        //mm +method requestHandler;   // name of the method to be called with request/response data.
        this.requestHandler = requestHandler;
    }

    static endpointMap = new Map();   // Map from endpoint name to RESTendpoint registration.
    //mm registerEndpoint( endpoint )$         // add and endpoint to REST service

    static registerEndpoint( endpoint ) {
        RESTendpoint.endpointMap.set(endpoint.endpointPath, endpoint );
        return endpoint;
    }

    //mm findEndpoint( String endpointPath)$   // lookup the path and return endpoint if any.
    static findEndpoint( endpointPath ) {
        let reg = RESTendpoint.endpointMap.get(endpointPath);
        return reg;
    }

    //mm handleRequest( endpoint, request, response, options )  calls handler method with a request and returns response.
    static handleRequest( endpoint, request, response, options ) {
        let url = request.url;
        let urlOptionsString = url.split('?');
        let urlOptionsArray;
        if ( urlOptionsString.length > 1 )
            urlOptionsArray = urlOptionsString.split('&');
        let urlArray = url.split('/');
        let aClass = endpoint.handlerClass;
        let aMethod = endpoint.requestHandler;
        // let handler = aClass.aMethod;
       return aMethod( endpoint, request, response, urlArray, urlOptionsArray );
    }
}

export default {
    RESTendpoint : RESTendpoint,
}