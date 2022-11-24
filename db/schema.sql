CREATE TABLE users
(
	id INTEGER AUTO_INCREMENT,
	username varchar(64),
	password varchar(64),
	primary key(id)
);

CREATE TABLE requests
(
	id INTEGER AUTO_INCREMENT,
	username varchar(64),
	origin varchar(64),
	text varchar(4096),
	primary key(id)
);
