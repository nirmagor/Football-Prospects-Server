# Football-Prospects-Server
The final product of the project is a website which enables inspection and modification of the football prospects data. 
The football prospects are players who will play in the upcoming draft. 
There are two type of clients:

  1. Observers - every user on earth who wants to inspect the  prospects
  2. Teams - authorized users who wantto inspect and modify the prospects
  


The server components:

#   Observer
      The observer module supports Read operations. An observer of the website would be able to:
          
          1. Inspect the prospects as a table
          2. Inspect each prospects profile

#   Team
      The team module supports CRUD operations. A team using the website would be able to:
      
          1. Inspect and modify the prospects data
          2. Create a board of prospects which it likes.
          
#   Profile
      An abstraction of a prospect profile. Every prospect will have a profile. 
      
#   Prospects
      An abstraction of a prospects table. 
      
#   Board
      An abstraction of the teams board. 
      
#   DB_Manager
      A midddleware which responsible for the deligation of CRUD operations in the different DBs through Profiles_Manager, Prospects_Manager and
      Board_Manager components.
      
#   Logger
      A component that is responsible for logging the CRUD operations in the system.

#   Profiles_Manager
      A component that is responsible for the deligation of CRUD operations in the profiles db.

#   Prospects_Manager
      A component that is responsible for the deligation of CRUD operations in the prospects db.

#   Board_Manager
      A component that is responsible for the deligation of CRUD operations in the board db.
