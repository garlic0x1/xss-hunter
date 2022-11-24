use crate::State;
use axum::extract::{Extension, Path};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum_sessions::extractors::ReadableSession;
use serde::Serialize;

// give the client payloads in JSON
pub async fn get_payloads(
    Extension(state): Extension<State>,
    session: ReadableSession,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();
    let hostname = state.hostname;
    let template = state.jinja.get_template("payloads.json").unwrap();

    let rendered = template
        .render(minijinja::context! {
            USERNAME => username,
            HOSTNAME => hostname,
        })
        .unwrap();

    ([("content-type", "application/json")], rendered)
}

pub async fn delete_request(
    Extension(state): Extension<State>,
    Path(path): Path<i32>,
    session: ReadableSession,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();

    let row: (String,) = sqlx::query_as("SELECT username FROM requests WHERE id=?")
        .bind(path)
        .fetch_one(&state.db_pool)
        .await
        .unwrap();

    if username != row.0 {
        // user doesnt own this record
        return StatusCode::UNAUTHORIZED;
    }

    let res = sqlx::query("DELETE FROM requests WHERE id=?")
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
struct RequestSchema {
    id: i32,
    origin: String,
    text: String,
}

pub async fn get_requests(
    Extension(state): Extension<State>,
    session: ReadableSession,
    // query: Query<DataQuery>,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();
    let rows: Vec<(i32, String, String)> =
        sqlx::query_as("SELECT id, origin, text FROM requests WHERE username=?")
            .bind(username)
            .fetch_all(&state.db_pool)
            .await
            .unwrap();

    let results = rows
        .iter()
        .map(|(id, origin, text)| RequestSchema {
            id: *id,
            origin: origin.to_string(),
            text: text.to_string(),
        })
        .collect::<Vec<RequestSchema>>();

    (
        [("content-type", "application/json")],
        serde_json::to_string(&results).unwrap(),
    )
}
