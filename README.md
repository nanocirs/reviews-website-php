# Reviews website (PHP/MySQL backend)
Functional and easy to install reviews website with rating (1-5 stars) on PHP and MySQL backend.

## Installation
First of all, make sure your server is able to run PHP and MySQL as they are required for this project to work. Then, copy all the files into the root of your website folder. 

Open `config.php` and set the database credentials where the reviews will be stored. You must set `$DB_HOST` to the host of your database, `$DB_USER` to the user of your database, `$DB_PASS` to the password of this user and `$DB_NAME` to the name of the database where you want to store the reviews. 

If the database you point this script to already has a table called _reviews_ installed by this system, the website will display the reviews stored in this database. If it is a table called _reviews_ but not installed by this system, it will not work as intended. To solve this, create a new database or delete the _reviews_ table.

Access index.html with the browser and you will have a working reviews system.

## Further information
The reviews table stores the IP of the user that entered the review as a way to prevent flooding. Every IP can publish a review once every 2 hours.
