pub fn db_connect() -> Result<sqlx::Pool<sqlx::MySql>, sqlx::Error> {
    let url = std::env::var("MYSQL_URL").unwrap();

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

pub async fn handle_error(_err: std::io::Error) -> impl axum::response::IntoResponse {
    (
        axum::http::StatusCode::INTERNAL_SERVER_ERROR,
        "Something went wrong...",
    )
}
