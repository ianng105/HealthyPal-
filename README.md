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

# Operation guide 
1.login/registration 
if you are new to this app, you can use register to create a new account in this app(for registration, you have to input a unique username, email and a safe password. If you have used our app before you can use your email and password to login.

1.5 body information
if you are new comer and you have registed, you will arrive to our information form page. Here you have to tell us your height, your weight,age ,sex and the goal of your diet , so we can use these data to calculate your TDEE.TDEE means how much calories you have to consume according to your activity level and we will calculate how much you should eat per meal.

2.After login or fill in your body information, is our home page. Here you can see other users share their meal,how healthy is their meal and the ingredients. Of course you can create a new post as well. 

3.search calories of food 

In the home page, of your right hand side, we have a list to show your total daily calories and what you have eaten.Then you have to press the add button and you will go to the search food page. Here you have to first fill in what food you have eaten into the input bar (one food each time) and press search. Then we will provide you choices for you to choose which food is closer to what you eat. You can press up button to increase the quantity and add button to add its calories to the total calories. Then you can press share.

4.share new post 
