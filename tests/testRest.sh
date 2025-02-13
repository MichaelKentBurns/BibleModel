#!/usr/bin/env zsh -v
host=localhost

if (( $# > 1 )) ; do
   host=Bible.MichaelKentBurns.com
done

echo "Target = $host"
url = "http://$host:3001"
echo "url = $url"

echo "======== Make first contact and get the overview:"
curl http://$url:3001/overview
sleep 5
curl http://localhost:3001/overview

echo "======== Get the current preferences settings:"
curl http://localhost:3001/preferences

echo "======== Get the entire state of the Bible object:"
curl http://localhost:3001/bible

echo "======== Get the list of Book objects:"
curl http://localhost:3001/books

echo "======== Get the list Book name abbreviations:"
curl http://localhost:3001/bookAbbreviations

echo "======== Get the first book of the new testament:"
curl http://localhost:3001/book/Matthew

echo "======== Get the first book of the new testament and it's contents:"
curl http://localhost:3001/book/Matthew/contents

echo "======== Get the first book of the old testament:"
curl http://localhost:3001/book/Ge

echo "======== Get the list of note objects:"
curl http://localhost:3001/notes

echo "======== Load and Get the list of note objects:"
curl http://localhost:3001/notes/load

echo "======== Save and Get the list of note objects:"
curl http://localhost:3001/notes/save -X post 

echo "======== Request something invalid:"
curl http://localhost:3001/somethingElse

echo "======== Stop the server: "
curl http://localhost:3001/stop

