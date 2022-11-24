use crate::State;
use axum::{
    extract::{Extension, Json, RequestParts},
    http::{Request, StatusCode},
    middleware::Next,
    response::IntoResponse,
};
use axum_sessions::extractors::{ReadableSession, WritableSession};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct UserCreds {
    username: String,
    password: String,
}

// protects auth layer
// if user is not logged in, send him to /login
pub async fn check_auth<B: Send>(req: Request<B>, next: Next<B>) -> impl IntoResponse {
    let mut request_parts = RequestParts::new(req);
    let session = request_parts.extract::<ReadableSession>().await.unwrap();

    let req = request_parts.try_into_request().expect("body extracted");

    if session.get::<String>("username").is_some() {
        next.run(req).await
    } else {
        StatusCode::UNAUTHORIZED.into_response()
    }
}

// let the client know if he is authenticated or not
pub async fn get_auth(session: ReadableSession) -> StatusCode {
    if session.get::<String>("username").is_some() {
        StatusCode::OK
    } else {
        StatusCode::UNAUTHORIZED
    }
}

// handle login attempts
pub async fn login(
    mut session: WritableSession,
    form: Json<UserCreds>,
    Extension(state): Extension<State>,
) -> impl IntoResponse {
    let row: Result<(i32, String, String), sqlx::Error> =
        sqlx::query_as("SELECT * FROM users WHERE username=?")
            .bind(form.username.clone())
            .fetch_one(&state.db_pool)
            .await;

    if let Ok(row) = row {
        let ver = bcrypt::verify(form.password.clone(), &row.2);
        if ver.is_ok() && ver.unwrap() {
            session
                .insert("username", row.1)
                .expect("could not sign in");
            session.insert("uid", row.0).expect("could not sign in");

            return StatusCode::OK;
        }
    }

    StatusCode::UNAUTHORIZED
}

// handle signup attempts
pub async fn signup(
    mut session: WritableSession,
    form: Json<UserCreds>,
    Extension(state): Extension<State>,
) -> impl IntoResponse {
    if !validate_username(&form.username) {
        return StatusCode::NOT_ACCEPTABLE;
    }

    if sqlx::query("SELECT * FROM users WHERE username=?")
        .bind(form.username.clone())
        .fetch_one(&state.db_pool)
        .await
        .is_ok()
    {
        return StatusCode::UNAUTHORIZED;
    }

    sqlx::query("INSERT INTO users (username, password) VALUES (?, ?)")
        .bind(form.username.clone())
        .bind(bcrypt::hash(form.password.clone(), bcrypt::DEFAULT_COST).unwrap())
        .execute(&state.db_pool)
        .await
        .unwrap();

    let row: (i32, String) = sqlx::query_as("SELECT id, username FROM users WHERE username=?")
        .bind(form.username.clone())
        .fetch_one(&state.db_pool)
        .await
        .unwrap();

    session
        .insert("username", row.1)
        .expect("could not sign in");
    session.insert("uid", row.0).expect("could not sign in");

    StatusCode::OK
}

// remove session on logout
pub async fn logout(mut session: WritableSession) -> impl IntoResponse {
    session.destroy();
    StatusCode::OK
}

fn validate_username(input: &str) -> bool {
    let reserved = ["www", "app", "admin", "xss", "info", "dev", "api"];
    reserved.iter().all(|res| {
        println!("{input}, {res}");
        &input != res
    }) && input.chars().all(|c| c.is_alphanumeric() && c.is_ascii())
}
