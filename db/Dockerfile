FROM mysql:5.7

ENV MYSQL_ROOT_PASSWORD=secret \
    MYSQL_DATABASE=app

ADD schema.sql /docker-entrypoint-initdb.d

EXPOSE 3306
