## UML model for the BibleModel project

Node.js and it's main event loop is a pretty strange beast.  
Many articles are written.  With much reading and a lot of experimentation I have gotten this to work as a state machine.
I'm sure it can be improved.

### StateMachine: inside Bible.mjs and Book.mjs I have built a state machine. 
 
```mermaid
stateDiagram-v2
    [*] --> Init  : first time stateMachine is run it starts at Init
    [*] --> WaitBooks : every tick of the asynch timer restarts the stateMachine 
    Init --> LoadBooks
    LoadBooks --> promiseToLoadBooks 
    promiseToLoadBooks --> asynch_IO_Task: starts asynch task to read data
    asynch_IO_Task --> WaitBooks : restarts the state machine at WaitBooks
    LoadBooks --> WaitBooks
    WaitBooks --> [*] : breaks out of the stateMachine while still waiting
    WaitBooks --> BooksLoaded : when the load is done continue stateMachine
    BooksLoaded --> SaveBooks
    SaveBooks --> BooksSaved
    BooksSaved --> WhatsNext 
    WhatsNext --> ShutDown
    ShutDown --> [*]
    ShutDown --> Abort 
    Abort --> [*]

```
[<a href="https://mermaid.js.org/syntax/classDiagram.html">docs</a> - <a href="https://mermaid.live/edit#pako:eNpdkTFPwzAQhf-K5QlQ2zQJJG1UBaGWDYmBgYEwXO1LYuTEwXYqlZL_jt02asXm--690zvfgTLFkWaUSTBmI6DS0BTt2lfzkKx-p1PytEO9f1FtdaQkI2ulZNGuVqK1qEtgmOfk7BitSzKdOhg59XuNGgk0RDxed-_IOr6uf8cZ6UhTZ8bvHqS5ub1mr9svZPbjk6DEBlu7AQuXyBkx4gcvDk9cUMJq0XT_YaW0kNK5j-ufAoRzcihaQvLcoN4Jv50vvVxw_xrnD3RCG9QNCO4-8OgpqK1dpoJm7smxhF7agp6kfcfB4jMXVmmalW4tnFDorXrbt4xmVvc4is53GKFUwNF5DtTuO3-sShjrJjLVlqLyvNfS4drazmRB4NuzSti6386YagIjeA3a1rtlEiRRsoAoxiSN4SGOOduGy0UZ3YclT-dhBHQYhj8dc6_I">live editor</a>]

