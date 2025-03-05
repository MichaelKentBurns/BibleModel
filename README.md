# BibleModel
Data model / database containing complete text of the Bible, Cross References,  Notes and other references

## Purpose:
The purpose of this project is to contain complete copies of the Bible in various translations.  
Allow structured access to the books, chapters, and verses of the entire Bible.  
It also contains a massive list of cross references.  It allows me to store notes and other structured and unstructured data about the Bible that I have gleaned from reading and study. 
It is NOT a reader or a study tool per se.  That will be another project.

## Inspiration:
The inspiration for this project is my love for the Scripture.  
The Bible is the most remarkable book ever written.  
I have read the Bible since I started reading as a child. 
I will never exhaust the depths of the riches of this book, no one ever has or ever will. 

## Sources:
The initial raw data is a GitHub project named **scrollmapper / bible_databases** 
which can be found on GitHub: https://github.com/scrollmapper/bible_databases

## Choice of language.
This project is the first of several using different programming technology and tools.
Javascript is a very widely used language because of the web explosion.
* IMO it is a camel, which is a horse designed by a committee.   
* It evolved over many years at the hands of lots of players. 
* I have programmed in many languages, and my initial reaction is yuck!  
* It's overly complicated by many different ways of doing things.
* It's syntax is way too complicated.
* It is used in different environments in very different ways. 

But, to be fair, I have decided to try this first in Javascript because that is what my mentees use and 
I need to learn it better and give it a fair chance.

### What I have learned about JavaScript in the process (so far), and what you should know (and install) if you want to use this project.   Take the time to tool up. 
1. My initial rant about too many runtimes, too much history, too many ways to do things, and wierd asynch.  Has pretty much been resolved by learning more history and particularly ECMAScript initiative.
   See Wikipedia articles:  https://en.wikipedia.org/wiki/ECMAScript and https://en.wikipedia.org/wiki/ECMAScript_version_history .  The good stuff I needed is in the 14th edition ECMAScript 2023.
2. Related is the set of documents that details the ECMAScript API docs that are referenced at the end of the second of those two Wikipedia pages.  Specifically https://262.ecma-international.org/14.0/
3. The Node.js effort including the programs
    - node - executes node programs
    - npm - Node Package Manager - manages packages (like this one BibleModel) and executes target scripts according to the details in the package.json file.  Finally, it will also execute test scripts (see issue #4  We need a robust set of unit tests written.  )
    - nvm - Node Version Manager - manages a collection of different versions of Node.js so you can install new versions but also use any particular version for specific projects.   I found this VERY helpful.
4. The Node.js "latest" documentation: https://nodejs.org/docs/latest/api/   I mentioned this in issue #7
5. One of the major lessons there was the node:sqlite section and DatabaseSync as described in issue #1
6. Some other things I learned along the way is a variety of new IDEs available.   Several of them are different packaging of the IDE from VS Code.
     - WebStorm (like it's sibling PhpStorm) from JetBrains.   Still a PC (Mac, Linux, Windows) based IDE application.
     - Google IDX (https://idx.dev) is a containerized version of VS Code that is accessible from any web browser.  I like this one a lot because it allows me to do my work from my Mac or PC using a browser, or better yet, my iPad Pro using my browser.
     - And related is GitHub Codespace (https://github.com/features/codespaces) which very quickly builds a docker container with all the Linux development tools, the VS Code IDE, and GitHub with your GitHub repository pre cloned, all rolled into one neet package.  You can access it very easily from https://GitHub.com.  All you need is a browser. 

## Real Life Object Model
See the article titled **Object Design of a Bible Study Application**
https://michaelkentburns.com/index.php/software-design/object-design-of-a-bible-study-application/

## Methods.
My hope is that I can code this to be run both on the backend and frontend.
Node.js is meant for server side javascript.
Javascript in general was intended and is most often used in the browser.
Some of the browser side use is with the javascript existing in .js files that are sourced in from the html.
Othertimes, the javascript is inserted directly in the HTML with an inline script.

My hope is that I can have this all in one project directory.  
When that project is cloned onto a backend server it can be run from a ssh command line using shell interactions and standard programming tools.
When it is cloned onto a client machine, I hope that it can be at least viewed entirely through a browser, and possibly edited.

Later, I will re-implement this in various other languages:
Smalltalk using Pharo, and possibly Amber (smalltalk compiled into javascript).
Swift that can produce Mac, iPhone, iPad applications, but can also produce Linux and Windows executables. 
Probably others. 

## Notes.
There is a Notes directory in the project where I will drop text files explaining issues and solutions as needed. 

## Issues.
In the GitHub project http://GitHub.com/MichaelKentBurns/BibleModel you will find a tab labeled 'Issues'.   Unfortunately that list of issues is NOT available in a local clone of the project.   So, you have to go to the web interface of GitHub.com using the link above.  In the upper left of that page, between the GitHub logo (A cat) and my picture next to the repository name 'BibleModel' you will see the tab bar consisting of the following tabs:  Code, Issues, Pull requests, Discussions, Actions, Projects, Wiki, Security and Insights.   Click on 'Issues'.

There you will find a list of issues that are under work.  Right above the list, on the left, you will see 'Open # Closed #' with 'Open' lit up to indicate you are looking at the list of open issues.  You can also see the Closed issues by clicking on 'Closed'.  This project is very much an exploratory learning exercise.  The issue discussions will tell you about what problems/challenges I have encountered, and what I have done to resolve them.  NOTE: All issues have a number representing the order they were created.  As a result, you probably want to read them in numeric order even though they normally are listed newest to oldest.  At the far right of the header for that table there is an elipsis "...".  That menu allows you to sort them by 'Created on' and 'Oldest'.   

## Back to the main display where you can read the README.md file.

As usual, if you click on the 'Code' tab label, you will see the directory listing of the code and other files.   Below that you will find the formatted presentation of this README.md file.  

## Object Model
A big goal of this project is to demonstrate the software design techniques I learned in my 40 year career.  

The design model is illustrated in UML diagrams that are contained in markdown (*.md) in a folder at the top level of the repository called ObjectModel.  The top level design page is in ObjectModel.md.  Click on that.  Just above the large header 'ObjectModel.md' you will see three tabs labeled Preview, Code, and Blame.   It should show the Preview pane.  

If you look in the 'Code' tab, you will see the "markdown" source code that produces the nice looking version.  After reading the first two paragraphs, you will see a line above 'classDiagram'.  That "```mermaid" tag is majic that cause the mermaid rendering to begin.   Below that you will see a pretty readable description of the object class Bible, its attributes and operations.   That is how this diagram is authored, its the UML diagram coding language if you will.  

If you then, go back to the Preview tab, instead of the words you will see a picture called a class diagram.   It is reasonably self explanatory.  Outside of the Class Bible rectangle, you will see arrows to other classes.  The line with a diamond at the beginning should be read as 'Contains'.   So, a Bible containss Testaments, and Books.  Books contain Chapters, which contain Verses and Notes.  

There is much more to the design than this simplified overview diagram.   Those details are contained in the other *.md (markdown) files.  

If you clone this project to your own copy and use an IDE such as VS Code, you can browse these files, but you likely will not see the picture view.  You will need to go to the Extensions tab on the sidebar of the IDE.  Search for the 'Mermaid Chart' extension and install it.   Once you have done that you will be able to see the preview view with the rendered diagram. 

The IDE will have an icon to the right of the tabs for the open .md files.  The icon looks like a two pane window with a tiny magnifying class.  Click on that and you should see the preview appear to the right.    

