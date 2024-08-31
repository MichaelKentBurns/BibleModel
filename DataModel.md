# DataModel.md
This file describes the object model that manages the raw data from the original SQL database 
and provides and manages that data at runtime.  

## Basics of object modeling using the UML language.

UML stands for Unified Modelling Language.  
[Wikipedia describes the history of its development](https://en.wikipedia.org/wiki/Unified_Modeling_Language).

### For full disclosure:  
I am a HUGE proponent of the use of UML.  I used it extensively during my career
at [SAS Institute](https://en.wikipedia.org/wiki/SAS_Institute).  I was one of the employees that was part of the origins of the formalized use of 
[metadata](https://en.wikipedia.org/wiki/Metadata).
The original metadata database for SAS products was written for a single specific project.  
It was called the "Metabase" (Metadata database) written in a SAS Proprietary object-oriented language
called SCL (Screen Control Language).   It was written by one guy while flat on his back in the hospital
after back surgery.   He knew the details of how data and programs were described in our products and 
wrote SCL code to model that.  If the details changed he would have to go back into the SCL and modify it 
to match.   Since this was a fairly simple model, that was not too much effort.

However, when it was decided that all metadata for all SAS' many products would be incorporated into a
single metadata model, it was quite a huge task.  
[See the product documentation of the metadata model](https://support.sas.com/documentation/cdl/en/omamodref/67417/HTML/default/viewer.htm#hierlist.htm).
There are 172 different data types described.   My team's job was to implement a metadata server that would
provide access to the storage of all of that metadata for 
[all 300+ SAS products](https://support.sas.com/en/software/all-products-support.html)
Those products were growing and changing constantly.  
To implement all of that by hand coding classes was a monstrous job that would have taken a large team
years to implement and maintained.  

I thought there was a better way.  I attended a software development conference called SD2000 in San Jose, 
California (where I went to university).   Several of the presenters were the pioneers in the latest
software development methodoligies and technologies.   I took what I learned there and came back to 
work and pitched the idea of using the UML language and the applications to build and manage the model
as a tool.   One of our team members learned to used those modeling tools, and her job was to visit with
the development teams for all SAS products.  She learned what metadata they needed to to make their product 
work and built a standardized model that unified all metadata for all those products.  

Meanwhile, I wrote a program called ModelCompiler (in Java) which would read in that model from the tools
and generate C source code to implement the model in the
[metadata server that our team built](https://support.sas.com/en/software/metadata-server-support.html). 
That code was compiled and linked into our products so that they could access the server. 

## CRC - Class Responsibility, Collaborator cards
A precursor to the UML was an intentionally simplified method of describing the basics of 
Object-Oriented software design.   
[Wikipedia has a good page describing this](https://en.wikipedia.org/wiki/Class-responsibility-collaboration_card) that should be
required reading (Read it!). 

CRC cards were written on 3x5" index cards during a design session.  As the team discussed the design,
whenver they determined they needed a new class they would grab a blank card and write the basics then
put the card on the table.  When a new card was introduced it would be laid next to the cards that it 
relates to, and its name was written on the 'collaborators' section of those cards.   As the team discussed
the design they would rearrange the cards and talk their way through common usage scenarios.  

This is admittedly a very simple design process, but it proved to be very effective and low cost 
design method.

There are simple web applications to create CRC cards. 
Images of some CRC Cards and a CRC design.
![](/Users/Michael/Bible/BibleModel/Notes/images/crcCardLayout.jpg)
![](/Users/Michael/Bible/BibleModel/Notes/images/crc.gif)
![](/Users/Michael/Bible/BibleModel/Notes/images/ooad-presentatin-crc-cards-11-638.jpg)
![](/Users/Michael/Bible/BibleModel/Notes/images/th-3677258138.jpeg)
![](/Users/Michael/Bible/BibleModel/Notes/images/crcModel.jpg)
As a result, I will now present a basic CRC card design for this project.

## UML model for the BibleModel project

### Package: BibleModel 

#### Class: DataSource.js

#### Class: Bible.js

#### Class: Book.js 

#### Class: Location.js

#### Class Xref.js 