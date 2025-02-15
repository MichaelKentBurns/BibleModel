#!/usr/bin/env zsh -v
host=localhost
port=8081

#if (( $# > 1 )) ; do
#   host=Bible.MichaelKentBurns.com
#done

echo "Target = $host"
url = "http://$host:$port"
echo "url = $url"

echo "======== Make first contact and get the overview:"
curl http://$url:3001/overview
sleep 5
curl http://localhost:$port/overview

echo "======== Get the current preferences settings:"
curl http://localhost:$port/preferences

echo "======== Get the entire state of the Bible object:"
curl http://localhost:$port/bible

echo "======== Get the list of Book objects:"
curl http://localhost:$port/books

echo "======== Get the list Book name abbreviations:"
curl http://localhost:$port/bookAbbreviations

echo "======== Get the first book of the new testament:"
curl http://localhost:$port/book/Matthew

echo "======== Get the first book of the new testament and it's contents:"
curl http://localhost:$port/book/Matthew/contents

echo "======== Get the first book of the old testament:"
curl http://localhost:$port/book/Ge

echo "======== Get the list of note objects:"
curl http://localhost:$port/notes

echo "======== Load and Get the list of note objects:"
curl http://localhost:$port/notes/load

echo "======== Save and Get the list of note objects:"
curl http://localhost:$port/notes/save -X post

echo "======== Request something invalid:"
curl http://localhost:$port/somethingElse

echo "======== Stop the server: "
curl http://localhost:$port/stop

