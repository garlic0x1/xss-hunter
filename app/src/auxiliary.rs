use std::collections::HashMap;

use axum::http::HeaderMap;

pub fn db_connect() -> Result<sqlx::Pool<sqlx::MySql>, sqlx::Error> {
    let url = std::env::var("DATABASE_URL").unwrap();

    let mut tries = 15;

    loop {
        match sqlx::Pool::connect_lazy(&url) {
            Ok(pool) => {
                println!("connected to database");
                break Ok(pool);
            }
            Err(err) => {
                if tries > 0 {
                    std::thread::sleep(std::time::Duration::from_secs(3));
                    tries -= 1;
                } else {
                    break Err(err);
                }
            }
        }
    }
}

// load templates
pub fn jinja_env() -> minijinja::Environment<'static> {
    let mut env = minijinja::Environment::new();
    println!("{}", concat!(env!("CARGO_MANIFEST_DIR"), "/templates/"));
    env.set_source(minijinja::Source::from_path(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/templates/"
    )));
    env
}

pub fn serialize_headers(headers: HeaderMap) -> String {
    let mut map = HashMap::new();
    headers.iter().for_each(|(key, value)| {
        map.insert(
            key.as_str().to_string(),
            value.to_str().unwrap_or_default().to_string(),
        );
    });
    serde_json::to_string(&map).unwrap_or_default()
}

pub async fn handle_error(_err: std::io::Error) -> impl axum::response::IntoResponse {
    (
        axum::http::StatusCode::INTERNAL_SERVER_ERROR,
        "Something went wrong...",
    )
}
