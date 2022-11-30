# FROM rust:latest
# WORKDIR /app
# COPY . .

# EXPOSE 8080

# CMD ["cargo", "run", "--release"]


# much faster solution, no longer works
# with SQLx macros, since they need a db
# connection to compile

FROM rust:latest AS chef
RUN cargo install cargo-chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

COPY . .
RUN cargo build --release --bin app

FROM debian:latest AS runtime
WORKDIR app
COPY --from=builder /app/target/release/app .
COPY ./frontend ./frontend
COPY ./templates ./templates

EXPOSE 8080

CMD ["./app"]
