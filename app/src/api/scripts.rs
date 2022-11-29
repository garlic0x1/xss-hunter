use crate::State;
use axum::extract::{Extension, Json, Path};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum_sessions::extractors::ReadableSession;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct Scripts {
    id: i32,
    uri: Option<String>,
}

pub async fn get_scripts(
    Extension(state): Extension<State>,
    session: ReadableSession,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();

    let rows = sqlx::query_as!(
        Scripts,
        "SELECT id, uri FROM scripts WHERE username=?",
        username
    )
    .fetch_all(&state.db_pool)
    .await
    .unwrap();

    (
        [("content-type", "application/json")],
        serde_json::to_string(&rows).unwrap(),
    )
}

#[derive(Deserialize)]
pub struct Script {
    uri: String,
}

pub async fn add_script(
    Extension(state): Extension<State>,
    Json(post_data): Json<Script>,
    session: ReadableSession,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();

    let res = sqlx::query("INSERT INTO scripts (username, uri) VALUES (?, ?)")
        .bind(username)
        .bind(post_data.uri)
        .execute(&state.db_pool)
        .await;

    if res.is_ok() {
        StatusCode::OK
    } else {
        StatusCode::BAD_REQUEST
    }
}

pub async fn delete_script(
    Extension(state): Extension<State>,
    Path(path): Path<i32>,
    session: ReadableSession,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();

    let row: (String,) = sqlx::query_as("SELECT username FROM scripts WHERE id=?")
        .bind(path)
        .fetch_one(&state.db_pool)
        .await
        .unwrap();

    if username != row.0 {
        // user doesnt own this record
        return StatusCode::UNAUTHORIZED;
    }

    let res = sqlx::query("DELETE FROM scripts WHERE id=?")
        .bind(path)
        .execute(&state.db_pool)
        .await;

    if res.is_ok() {
        StatusCode::OK
    } else {
        StatusCode::IM_A_TEAPOT
    }
}
