Getting Started with React Back-end and Front-end
To get started, follow these instructions:

1. Open a new terminal.
2. Change directory to the back-end folder and run npm install
3. Run the command node app.js or npm start to start the back-end server.

Once the back-end server is running:

1. Open a new terminal.
2. Change directory to the front-end folder and run npm install
3. Run the command npm start to start the front-end development server.

Now, you should have both the back-end and front-end servers up and running, allowing you to develop and test your React application.

Create a .env file

1. Create a new file named .env in the root directory of your project.
2. Set up MySQL Connection Parameters:
   Inside the .env file, define the following environment variables:
   MYSQL_HOST=your_mysql_host
   MYSQL_USER=your_mysql_user
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=your_mysql_database
   Replace your_mysql_host, your_mysql_user, your_mysql_password, and your_mysql_database with your MySQL server's host, user, password, and database name respectively.
3. Save Changes:
   Save the .env file.
4. Environment Variable Explanation:
   MYSQL_HOST: The hostname or IP address of your MySQL server.
   MYSQL_USER: The username used to connect to your MySQL server.
   MYSQL_PASSWORD: The password associated with the username for MySQL server authentication.
   MYSQL_DATABASE: The name of the MySQL database you want to connect to.
