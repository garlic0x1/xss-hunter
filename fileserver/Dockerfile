FROM rust:latest
WORKDIR /fileserver
COPY . .
RUN cargo install --path .

EXPOSE 3000

CMD ["fileserver"]
