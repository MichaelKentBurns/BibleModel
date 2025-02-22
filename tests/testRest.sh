#!/usr/bin/env zsh -v
host=localhost
port=8082

echo "Target = $host"
url = "http://$host:$port"
echo "url = $url"

echo "======== Make first contact and get the overview:"
curl http://$host:$port/Bible/overview
curl http://$host:$port/Bible/

echo "======== Get the current server status:"
curl http://$host:$port/Bible/status

echo "======== Get the current preferences settings:"
curl http://$host:$port/Bible/preferences

echo "======== Get the entire state of the Bible object:"
curl http://$host:$port/Bible/bible

echo "======== Get the list of Book objects:"
curl http://$host:$port/Bible/books

echo "======== Get the list Book name abbreviations:"
curl http://$host:$port/Bible/bookAbbreviations

echo "======== Get the first book of the new testament:"
curl http://$host:$port/Bible/book/Matthew

echo "======== Get the first book of the new testament and it's contents:"
curl http://$host:$port/Bible/book/Matthew/contents

echo "======== Get the first book of the old testament:"
curl http://$host:$port/Bible/book/Ge

echo "======== Get the list of note objects:"
curl http://$host:$port/Bible/notes

echo "======== Get the first note objects:"
curl http://$host:$port/Bible/note/1

echo "======== Load and Get the list of note objects:"
curl http://$host:$port/Bible/notes/load

echo "======== Save and Get the list of note objects:"
curl http://$host:$port/Bible/notes/save -X post

echo "======== Request something invalid:"
curl http://$host:$port/Bible/somethingElse

echo "======== Request a listing of Public files and directories:"
curl http://$host:$port/

echo "======== Request a specific simple file in Public:"
curl http://$host:$port/ruThere.txt

echo "======== Request a listing of BibleModel files and directories:"
curl http://$host:$port/BibleModel

echo "======== Request a the BibleModel README.md file:"
curl http://$host:$port/BibleModel/README.md

echo "======== Stop the server: "
curl http://$host:$port/Bible/stop

