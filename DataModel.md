# DataModel.md
This file describes the object model that manages the raw data from the original SQL database 
and provides and manages that data at runtime.  

## Basics of object modeling using the UML language and CRC Cards.
See my page on [Software Design](https://michaelkentburns.com/index.php/software-design/) for a discussion of design principles, UML, and CRC Cards.
I will now present a basic CRC card design for this project.

## UML model for the BibleModel project

### Package: BibleModel 

#### Class: DataSource.js

#### Class: Bible.js

#### Class: Book.js 

#### Class: Location.js

#### Class Xref.js 

#### Class TestUML
``` mermaid
---
title: Animal example
---
classDiagram
    note "From Duck till Zebra"
    Animal <|-- Duck
    note for Duck "can fly\ncan swim\ncan dive\ncan help in debugging"
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
```