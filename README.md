## REST API with TypeORM and PostgreSQL
This is a RESTful API built with Node.js and Express.js, utilizing PostgreSQL as the database management system with TypeORM for ORM (Object-Relational Mapping).

# Description
This API provides endpoints for user authentication, CRUD operations on notes, and user management functionalities.

# Technologies Used
* Node.js
* Express.js
* PostgreSQL
* TypeORM
* TypeScript
* bcrypt (Password hashing)
* jsonwebtoken (JWT authentication)
# Installation
1. Clone the repository: 

git clone https://github.com/AngelGeorgievStoyanov/rest-api-typeorm.git

2. Install dependencies: 

cd rest-api-typeorm
npm install
3. Set up your PostgreSQL database and update the connection details in data-source.ts.

4. Run the server

npm run dev

## Endpoints
# Authentication
* POST /auth/register: Register a new user.
* POST /auth/login: Authenticate a user and generate a JWT token.
# Notes
* POST /note/create: Create a new note.
* GET /note/getNotesByOwnerId/:ownerId/page/:page/pageSize/:pageSize/sortOrder/:sortOrder: Get notes by owner ID with pagination and sorting.
* GET /note/getNoteById/:noteId: Get a note by ID.
* POST /note/update/:noteId: Update a note by ID.
* DELETE /note/delete/:noteId: Delete a note by ID.
* POST /note/completed/:noteId: Mark a note as completed.
* POST /note/tableCompleted: Mark multiple notes as completed.
* DELETE /note/tableDeleteNotes: Delete multiple notes.


## Frontend Integration

This REST API is intended to be used in conjunction with the corresponding frontend project. The frontend can be found at: [notes-react-ts](https://github.com/AngelGeorgievStoyanov/notes-react-ts).


## Alternative Implementations

This project also has an alternative implementation using raw PostgreSQL queries without TypeORM. You can find the original implementation at: [rest-api-postgresql] (https://github.com/AngelGeorgievStoyanov/rest-api-postgresql).

Similarly, the PostgreSQL project mentions the TypeORM-based implementation, providing flexibility based on your preferences and project requirements.
