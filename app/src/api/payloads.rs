use crate::State;
use axum::extract::{Extension, Json, Path};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum_sessions::extractors::ReadableSession;
use serde::{Deserialize, Serialize};

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
