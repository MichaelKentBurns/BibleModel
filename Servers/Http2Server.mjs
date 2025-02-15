import {createSecureServer} from 'node:http2';
import {readFileSync} from 'node:fs';

export class Http2Server {
    constructor(options) {
        this.options = options;
    }

    static http2SecureServer = undefined;

    static setup() {
        Http2Server.http2SecureServer = createSecureServer({
            key: readFileSync('localhost-privkey.pem'),
            cert: readFileSync('localhost-cert.pem'),
        });

        Http2Server.http2SecureServer.on('error', (err) =>
            console.error(err));

        Http2Server.http2SecureServer.on('stream', (stream, headers) => {
            // stream is a Duplex

            const method = headers[HTTP2_HEADER_METHOD];
            const path = headers[HTTP2_HEADER_PATH];
            if ( traceHttpServer )  console.log('httpServer: methods=',method, ' path=',path);

            stream.respond({
                'content-type': 'text/html; charset=utf-8',
                ':status': 200,
            });
            stream.end('<h1>Hello World</h1>');
        });

    }

    static activateServer() {
        Http2Server.http2SecureServer.listen(8083);
    }
}