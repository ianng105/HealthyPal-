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

# public
in the public folder,it stores the css, and images which is used in the project.And there are two folders for image storage within the uploads folder in the public folder,one is image and one is avatar.
# views
inside the views folder their are 10 files. welcome.ejs is the first page when user reach , then we have register.ejs and login.ejs for the register and login page .Next is the bodyinfoForm and main.ejs . bodyinfoForm is a page for user to input their body information.And the main page is the page which user can see other user's post newPost.ejs is for user the share new post , searchFood.ejs is for user to search calories of food. bodyinfo.ejs is similar to bodyinfoForm, but it focus on display and update user's body information instead of create a new one.userProfile.ejs is for displaying data of user and posts they have shared and lastly, the editProfile is for editing user data.
# model
we have totally 4 models in our project.The first one is user.js, the second one is userbody.js,the third one is post.js and the last one is mongo.js. user and post is for doing crud operations on the user account and shared posts.userbody is for doing crud operations on the body information of user and the mongo one is for connection and use the database.
#
