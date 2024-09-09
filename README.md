# BibleModel
Data model / database containing complete text of the Bible, Cross References,  Notes and other references

## Purpose:
The purpose of this project is to contain complete copies of the Bible in various translations.  Allow structured access to the books, chapters, and verses of the entire Bible.  It also contains a massive list of cross references.  It allows me to store notes and other structured and unstructured data about the Bible that I have gleaned from reading and study. 
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
 <rant>
    IMO it is a camel, which is a horse designed by a committee.   It evolved over many years at the hands of lots of players.
    I have programmed in many languages, and my initial reaction is Blech!  
    It's overly complicated by many different ways of doing things.
    It's syntax is way too complicated.
    It is used in different environment in very different ways. 
 </rant>

But, to be fair, I have decided to try this first in Javascript because that is what my mentees use and 
I need to learn it better and give it a fair chance.

## Real Life Object Model
See the article titled **Object Design of a Bible Study Application**
https://michaelkentburns.com/index.php/software-design/object-design-of-a-bible-study-application/

## Methods.
My hope is that I can code this to be run both on the backend and frontend.
Node.js is meant for server side javascript.
Javascript in general was intended and is most often used in the browser.
Some of the browser side use is with the javascript existing in .js files that are sourced in from the html.
Othertimes, the javascript is inserted directly in the HTML with a <script> </script>. 

My hope is that I can have this all in one project directory.  
When that project is cloned onto a backend server it can be run from a ssh command line using shell interactions and standard programming tools.
When it is cloned onto a client machine, I hope that it can be at least viewed entirely through a browser, and possibly edited.

Later, I will re-implement this in various other languages:
Smalltalk using Pharo, and possibly Amber (smalltalk compiled into javascript).
Swift that can produce Mac, iPhone, iPad applications, but can also produce Linux and Windows executables. 
Probably others. 

## Notes.
There is a Notes directory in the project where I will drop text files explaining issues and solutions as needed. 


