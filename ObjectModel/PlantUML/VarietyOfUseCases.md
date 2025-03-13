@startuml


(Simple Bible Reader) as UC1 
:Seeker: --> UC1 

(Deep Read) as UC2
:Discipler: --> (UC2)

:Seminarian: --> (Follow Xrefs)

(Take Notes) as UC4
(Assemble Quotes) as UC5
:Scholar: --> (UC4) 
(Create Bibliograhy) as UC6
:Scholar: --> (UC5)
:Scholar: --> (UC6)


@enduml