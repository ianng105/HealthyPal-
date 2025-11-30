# HealthyPal
We are group 7(13170500 Ng Man Yau Ian)our project name is HealthyPal.
HealthyPal is a diet, social media application.Users can check the calories of their meal and share it with others who are dieting as well.
We build a community of diet,to encourage and alert each other.

# app.js 
the app.js file provide login, logout , register,search calories of food using fatsecret's api,create,edit and delete posts, calculate user's BMR and TDEE.The body of most of these function are put into the controller files in the controller folder.

# package.json
body-parser: parse the request from the request body to json format 
    connect-mongo:it stores session data to mongo db
    cors: for browser to make cross origin http request 
    dotenv: loads the environment data from the .env file 
    ejs: for using ejs in this project
    express: for using express in this project
    express-session: manage session in express
    method-override: for overriding http method 
    mongodb: for using mongodb in this project
    mongoose: for using ODM in this project
    multer: for uploading images 
    oauth: for authentication using the fatsecret api
