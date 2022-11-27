CREATE TABLE users
(
	id INTEGER AUTO_INCREMENT,
	username varchar(64),
	password varchar(64),
	primary key(id)
);

CREATE TABLE pages
(
	id INTEGER AUTO_INCREMENT,
	username varchar(64),
	origin varchar(64),
	body varchar(4096),
	time TIMESTAMP,
	primary key(id)
);
