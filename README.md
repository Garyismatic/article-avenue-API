# Northcoders News API

This project utilises the dotenv npm package to switch between our test and development database.

The .env files have been ommited from the git repository through the use of .gitignore, anyone who wishes to connect to the database will need to setup their own .env files .env.test and .env.development respectively.

To create the files the user will need to download the npm dotenv package and create two files in the root directory .env.test and .env.development, inside each of the files should be the reference to the database 

`PGDATABASE=nc_news_test` inside .env.test 

and 

`PGDATABASE=nc_news` inside .env.development.

the project will now be able to access either database.



