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
    let callback_url = format!(
        "http://{}/callback/{}",
        std::env::var("HOSTNAME").unwrap(),
        user
    );

    let template = state.jinja.get_template("probe.js").unwrap();
    axum::response::Html::from(
        template
            .render(minijinja::context! { HOST_URL => callback_url })
            .unwrap(),
    )
}

// collect info from probe
pub async fn collector(
    Extension(state): Extension<State>,
    Path(user): Path<String>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    body: Request<Body>,
) {
    let mut text_record = format!("{:?}", body);

    // trim to fit in database
    if text_record.len() > 1024 {
        text_record = (text_record[0..1024]).to_string();
    }

    sqlx::query("INSERT INTO requests (username, origin, text) VALUES (?, ?, ?)")
        .bind(user)
        .bind(peer.to_string())
        .bind(text_record)
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
