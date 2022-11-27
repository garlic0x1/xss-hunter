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
	peer varchar(32),
	
	-- headers stored as json
	headers varchar(2048),

	-- probe post data
	uri varchar(256),
	cookies varchar(1024),
	referrer varchar(256),
	user_agent varchar(256),
	origin varchar(256),
	title varchar(256),
	text varchar(4096),
	dom varchar(4096),
	was_iframe varchar(16),

	time TIMESTAMP,
	primary key(id)
);
