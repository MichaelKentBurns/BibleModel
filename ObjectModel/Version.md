@Mermaid markup extracted from Version.mjs
 # Class: Version

 A named version of the Bible and the table for the text of all it's verses.

 ## Responsibilities:
 * name - the formal name for the version.
 * abbreviation - the abbreviated version code.

 ## Collaborators:
 * bible - Each instance of Bible must be associated with a version. 
 ```mermaid
 classDiagram
    class Version {
         +Note[] notes  // array of notes
         +Bible  bible  // the bible that is loaded from this version
             integer id   // numeric unique identifier
             String table  // name of table in database for text
             String abbreviation  // abbreviated name used as a code name
             String language   // language of text
             String  infoText  // any textual information about the version 
             URL     infoUrl   // url for information about this version
             String  publisher  // name of publisher of this version
             String  copyright  // name of copyright 
             String  copyrightInfo   // text of information about copyright
     ~setBible(aBible)$   // sets the Bible that contains this book
     ~getVersionNamed(String name)$    // return the version for a given name
     ~getVersionNamed(String name)$    // return the version for a given name
     ~getVersionNamed(String name)$    // return the name of the table version for a given named version
     ~loadAll()$   // loads all versions into static array
 }
 Bible --- Version
 Version *-- Note
 ```
