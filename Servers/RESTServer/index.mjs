#!/usr/bin/env node
/*
 *  index.mjs
 *
 *   start HTTPserver.mjs of HTTP-Server with settings for this project folder
 *
 *   ex: ( $ node index.mjs 8080 )
 *
 *   which is short for: ( $ node HTTPserver.mjs ../../ ../../public 8080 ) from this working folder
 *
 */

let spawn = require('child_process').spawn,
path = require('path'),

uri_root = path.join(__dirname, '../../'),
uri_public = path.join(uri_root, '../Public'),
uri_server = path.join(__dirname, 'HTTPserver.mjs')

let ls = spawn('node', [uri_server, uri_root, uri_public, process.argv[2] || 8080]);

ls.stdout.on('data', function(data){
    console.log(data.toString());
});

ls.stderr.on('data', function(data){
    console.log(data.toString());
});

ls.on('exit', function (code) {
  console.log('Child process exited with exit code ' + code);
});
