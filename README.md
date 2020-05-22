# Application for book readers
This project is created as a part of a bachelor thesis.


## About
Application that serves book readers to
* Store their libraries
* Add information to their books, e.g. reviews, comments...
* Mark books borrowed to friends
* Make wishlist of books
* See if someone has bought some book for them to avoid buying it
* See which books do friends have in their wishlist and which of them are already booked by other friends

## Project status
Project is in development.

## Building and running
Installation:
1. Create a PostgreSQL database for the project to use.
1. Run all migrations scripts in `packages/backend/migrations` on your database in order.
1. Use your Google OAuth2 client id with allowed `localhost:3000` access and redirect or create your credentials on https://console.developers.google.com/apis/credentials if you do not have one.
   * More about creating Google credentials on: https://developers.google.com/identity/sign-in/web
1. Create `packages/backend/.env` as described in `packages/backend/.env-description.md` and `packages/frontend/.env` as described in `packages/frontend/.env-description.md` 
1. Run `npm run bootstrap` in the project root to install all dependencies.

Running:
1. To run the application use `npm run start-dev` in the project root.




