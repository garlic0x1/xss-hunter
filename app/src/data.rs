use crate::State;
use axum::extract::{Extension, Path};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum_sessions::extractors::ReadableSession;
use serde::Serialize;

pub async fn get_scripts(
    Extension(state): Extension<State>,
    session: ReadableSession,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();
}

// give the client payloads in JSON
pub async fn get_payloads(
    Extension(state): Extension<State>,
    session: ReadableSession,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();
    let public_url = std::env::var("PUBLIC_URL").unwrap();
    let template = state.jinja.get_template("payloads.json").unwrap();

    let rendered = template
        .render(minijinja::context! {
            USERNAME => username,
            PUBLIC_URL => public_url,
        })
        .unwrap();

    ([("content-type", "application/json")], rendered)
}

pub async fn delete_page(
    Extension(state): Extension<State>,
    Path(path): Path<i32>,
    session: ReadableSession,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();

    let row: (String,) = sqlx::query_as("SELECT username FROM pages WHERE id=?")
        .bind(path)
        .fetch_one(&state.db_pool)
        .await
        .unwrap();

    if username != row.0 {
        // user doesnt own this record
        return StatusCode::UNAUTHORIZED;
    }

    let res = sqlx::query("DELETE FROM pages WHERE id=?")
        .bind(path)
        .execute(&state.db_pool)
        .await;

    if res.is_ok() {
        StatusCode::OK
    } else {
        StatusCode::IM_A_TEAPOT
    }
}

// will be used for pagination
// #[derive(Deserialize)]
// pub struct DataQuery {
//     page: Option<u32>,
// }

#[derive(Serialize)]
struct CollectedPages {
    id: i32,
    uri: Option<String>,
    time: chrono::DateTime<chrono::Utc>,
}

pub async fn get_pages(
    Extension(state): Extension<State>,
    session: ReadableSession,
    // query: Query<DataQuery>,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();
    let rows = sqlx::query_as!(
        CollectedPages,
        "SELECT id, uri, time FROM pages WHERE username=?",
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

#[derive(Serialize)]
struct PageSchema {
    id: i32,
    username: Option<String>,
    peer: Option<String>,
    headers: Option<String>,

    // callback body
    uri: Option<String>,
    cookies: Option<String>,
    referrer: Option<String>,
    user_agent: Option<String>,
    origin: Option<String>,
    title: Option<String>,
    text: Option<String>,
    dom: Option<String>,
    was_iframe: Option<String>,

    time: chrono::DateTime<chrono::Utc>,
}

pub async fn get_page(
    Extension(state): Extension<State>,
    Path(path): Path<i32>,
    session: ReadableSession,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();

    let row = sqlx::query_as!(
        PageSchema,
        "SELECT 
            id, username, peer, headers,
            uri, cookies, referrer, user_agent,
            origin, title, text, dom, was_iframe,
            time
         FROM pages WHERE id=?",
        path
    )
    .fetch_one(&state.db_pool)
    .await
    .unwrap();

    if username != row.username.clone().unwrap() {
        // user doesnt own this record
        return StatusCode::UNAUTHORIZED.into_response();
    }

    (
        [("content-type", "application/json")],
        serde_json::to_string(&row).unwrap(),
    )
        .into_response()
}
