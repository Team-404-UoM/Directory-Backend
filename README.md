# Connected with Heroku and runs live on **http://member-directory.herokuapp.com/**
Removed Node_modules folder
Changed **app.listen(4000);** with **app.listen(process.env.PORT || 4000);**
