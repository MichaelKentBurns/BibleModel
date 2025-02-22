# README.md file for the BibleModel/Servers directory.

## Notes on my early experiments with simple http servers and integrating Dustin Pfister's demo server into BibleModel.

Mike Burns here, talking first about how BibleModel incorporates three
different web servers.

* First, on Dec 21, 2024, I started with a simple HttpServer.mjs which was a first
  attempt at using the node:http module.  At the same time I tried the node:http2.
  I quickly realized that http2 was a significant departure from http and more
  complex, so I set that aside and focused on the simple http server.   Over time
  I added simple REST endpoints, but that is all.  It did NOT have the mechanism
  for serving up files like a normal web server does.   The determination of which
  of the two was made in Bible.mjs based on a simple boolean: useHttp2.
* Later, I discovered Dustin Pfister's paper and GitHub repository.
  I experimented with a clone of his project and changed his common .js
  sources to EcmaScript Module .mjs files since I had already committed to
  using that newer standard.   It all converted pretty easily and worked.
  So, I folded those .mjs files into this BibleModel project.  I did all of
  that in the Servers/RESTServer directory and left the other sources at the
  top of the Server directory.  
