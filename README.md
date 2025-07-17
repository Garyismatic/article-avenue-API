# Article Avenue API

Hi and welcome to my project Article Avenue!

You can find this repository hosted at `https://article-avenue-api.onrender.com/api`

PROJECT SUMMARY:

This project is a backend API built to mimic real-world backend services, such as 'Reddit', and will serve information to a frontend architecture.

The project uses PostgreSQL and JavaScript to build endpoints that a client can use to get, post, patch, and delete data stored on the database. Some of the endpoints built also include the use of queries on our database, such as sort by and order in.

The project includes an `endpoints.json` file, which supplies information such as a description of the endpoint, an example request, and an example response.

The database is made up of four tables:

Topics
Articles
Comments
Users

The project's main purpose is to serve up news articles that can be categorised by their topic and include comments posted by users and the username of who has posted the comment. There is also functionality to increase and decrease votes on comments or articles.

SETTING UP REPO ON YOUR OWN LOCAL MACHINE:

You can clone this repository through your terminal from the directory of where you would like to store it on your local machine.

In the terminal type `git clone https://github.com/Garyismatic/NC-News.git`.

Go ahead and open the repository in your preferred code editor.

Open a new terminal and install Node Package Manager (NPM) with the command `npm init -y`.

Install the following packages as dependencies using the following commands in the terminal

`npm install pg`
`npm install pg-format`
`npm install express`
`npm install dotenv`

Install the following packages as Dev dependencies to successfuly run and complete tests.

`npm install -D jest`
`npm install -D supertest`
`npm install -D jest-sorted`

Now you should be ready to test and create new features within your own version of this repository.

SEEDING THE DATABASE:

This project makes use of the npm package dotenv to distinguish which database to seed from depending if you want to access the test database or the development database.

You will need to create 2 files in the root directory.

1. `.env.development` - in this file set the variable `PGDATABASE=nc_news`
2. `.env.test` - in this file set the variable `PGDATABASE=nc_news_test`

By doing this you will ensure that only the test database is seeded each time you run a test and is a much smaller sample size to work with and test against.

To begin setting up your database ready to use and manipulate run the following command in your terminal.

`npm run setup-dbs`

With the database now setup you can seed it by running the next command

`npm run seed`

Once the database has been seeded you can now run tests in the test file `__tests__/api.test.js` using the command

`npm test api.test.js`

Now you can begin to add your own features and writing your own tests in the test suites provided.


