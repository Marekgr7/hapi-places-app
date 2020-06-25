# hapi-places-app

Please note that front-end is in repo https://github.com/Marekgr7/hapi-places-app-frontend 

## General info

The main purpose of the application is to store favourite places of the users.

## Project is created with:

    Node.js
    Hapi.js
    MongoDB
    React

## Setup

To run this project, download repo and install it locally using npm install. Create collection in mongo db with two documents: users and places.

### Important
In root folder of app, folder should be created ,,personal-info" and file created "user-info.js" with urls to mongoDb, google maps API, and secret should be set for JWT authentication.

Also folder uploads/images should be created in root directory.

### Sample file

    class UserInfo {
    static mongoUrl = 'db url';
    static googleMapsApiKey = 'gogle maps key';
    static secretJwt = 'jwt secret';
    }
    
    module.exports = UserInfo;

To get google maps working in front-end please place yours google maps url in index file:

    <script
      src="URL-GOOGLE-MAPS"
      async
      defer
    ></script>
