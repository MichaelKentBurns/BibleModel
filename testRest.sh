echo "======== Make first contact and get the overview:"
curl http://localhost:3001/overview

echo "======== Get the entire state of the Bible object:"
curl http://localhost:3001/bible

echo "======== Get the list of Book objects:"
curl http://localhost:3001/books

echo "======== Get the list Book name abbreviations:"
curl http://localhost:3001/bookAbbreviations

echo "======== Get the first book of the new testament:"
curl http://localhost:3001/book/Matthew

echo "======== Get the first book of the old testament:"
curl http://localhost:3001/book/Ge

echo "======== Request something invalid:"
curl http://localhost:3001/somethingElse

echo "======== Stop the server: "
curl http://localhost:3001/stop

